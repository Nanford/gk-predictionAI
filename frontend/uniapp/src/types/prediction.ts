export type SubjectType = "physics" | "history";

export interface HistoryItem {
  year: number;
  minScore: number | null;
  minRank: number | null;
  avgScore: number | null;
  avgRank: number | null;
  planCount: number | null;
  isDemo: boolean;
}

export interface SourceItem {
  name: string;
  year: number;
  url: string;
}

export interface PredictionResult {
  id?: number;
  probability: number | null;
  probabilityLow: number | null;
  probabilityHigh: number | null;
  riskLabel: string;
  confidenceLevel: string;
  scope: "university-min-threshold" | "group" | "major";
  history: HistoryItem[];
  sourceItems: SourceItem[];
  warnings: string[];
  disclaimer: string;
}

export interface UniversitySearchItem extends PredictionResult {
  id: number;
  code: string;
  name: string;
  city: string;
  levelTags: string[] | null;
  representativeGroup: {
    id: number;
    code: string;
    name: string;
  };
}

export interface UniversityDetail {
  id: number;
  code: string;
  name: string;
  city: string;
  levelTags: string[] | null;
  officialUrl?: string;
  disclaimer: string;
  groups: Array<{
    id: number;
    code: string;
    name: string;
    subjectRequirements?: string;
    history: HistoryItem[];
    majors: Array<{
      id: number;
      code: string;
      name: string;
      category?: string;
    }>;
  }>;
}
