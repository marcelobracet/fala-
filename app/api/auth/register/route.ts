import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { CompanyModel } from "@/models/Company";
import { UserModel } from "@/models/User";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  companyName: z.string().min(2).max(80),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const { companyName, name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await UserModel.findOne({ email: normalizedEmail }).select("_id").lean();
  if (existing) {
    return NextResponse.json({ error: "email_in_use" }, { status: 409 });
  }

  // Market standard: bcrypt with a reasonable cost factor (12).
  const passwordHash = await bcrypt.hash(password, 12);

  // Create tenant (Company) + User.
  // Keep it minimal; later you can add billing provisioning, email verification, etc.
  const baseSlug = slugify(companyName);
  const slug = baseSlug || `company-${Date.now()}`;

  const company = await CompanyModel.create({
    name: companyName,
    slug,
  });

  await UserModel.create({
    companyId: company._id,
    name,
    email: normalizedEmail,
    passwordHash,
    authProviders: ["credentials"],
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}


