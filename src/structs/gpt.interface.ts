interface Highlight {
  title: string;
  attributes: {
    [key: string]: number;
  };
}

interface AnalysisResponse {
  conclusion: string;
  analysis: string;
  highlights: Highlight[];
}

export type { AnalysisResponse };
