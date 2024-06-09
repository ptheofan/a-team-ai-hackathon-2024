export interface EmotionScore {
  name: string;
  score: number;
}

export interface StressLevel {
  highLevel: EmotionScore[];
  lowLevel: EmotionScore[];
}

export interface PsychologicalStressReport {
  conclusion: string;
  summary: string;
  psychologicallyFine: StressLevel;
  positiveButCautious: StressLevel;
  neutral: StressLevel;
  mildlyStressed: StressLevel;
  moderatelyStressed: StressLevel;
  highlyStressed: StressLevel;
  classification: string;
}

export interface TruthfulnessReport {
  veryLikelyNotLying: StressLevel;
  possiblyNotLying: StressLevel;
  neutralUnclear: StressLevel;
  possiblyLying: StressLevel;
  veryLikelyLying: StressLevel;
  likelihood: string;
}

