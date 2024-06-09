export interface EmotionScore {
  [emotion: string]: number;
}

export interface StressLevel {
  highLevel: EmotionScore;
  lowLevel: EmotionScore;
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

