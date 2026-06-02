import { parse } from "csv-parse/sync";

export interface UniversityCsvRow {
  code: string;
  name: string;
  authority: string;
  provinceName: string;
  city: string;
  educationLevel: string;
}

interface RawUniversityCsvRow {
  code?: string;
  name?: string;
  authority?: string;
  province_name?: string;
  city?: string;
  education_level?: string;
}

const required = (label: string, value: string | undefined): string => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${label} is required`);
  }
  return normalized;
};

export const parseUniversityCsv = async (content: string): Promise<UniversityCsvRow[]> => {
  const records = parse(content, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as RawUniversityCsvRow[];

  return records.map((record) => ({
    code: required("University code", record.code),
    name: required("University name", record.name),
    authority: required("University authority", record.authority),
    provinceName: required("University province", record.province_name),
    city: required("University city", record.city),
    educationLevel: required("University education level", record.education_level)
  }));
};
