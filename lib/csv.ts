function escapeCsvValue(value: string) {
  // Quote if needed, and escape quotes by doubling.
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const lines: string[] = [];

  lines.push(headers.map(escapeCsvValue).join(","));

  for (const row of rows) {
    const values = headers.map((h) => {
      const v = row[h];
      if (v === null || v === undefined) return "";
      if (v instanceof Date) return escapeCsvValue(v.toISOString());
      return escapeCsvValue(String(v));
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}


