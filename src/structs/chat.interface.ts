import { TMessageOwner } from '../components/Message.tsx';

export interface ProsodyScores {
  admiration: number;
  adoration: number;
  aestheticAppreciation: number;
  amusement: number;
  anger: number;
  anxiety: number;
  awe: number;
  awkwardness: number;
  boredom: number;
  calmness: number;
  concentration: number;
  confusion: number;
  contemplation: number;
  contempt: number;
  contentment: number;
  craving: number;
  desire: number;
  determination: number;
  disappointment: number;
  disgust: number;
  distress: number;
  doubt: number;
  ecstasy: number;
  embarrassment: number;
  empathicPain: number;
  entrancement: number;
  envy: number;
  excitement: number;
  fear: number;
  guilt: number;
  horror: number;
  interest: number;
  joy: number;
  love: number;
  nostalgia: number;
  pain: number;
  pride: number;
  realization: number;
  relief: number;
  romance: number;
  sadness: number;
  satisfaction: number;
  shame: number;
  surpriseNegative: number;
  surprisePositive: number;
  sympathy: number;
  tiredness: number;
  triumph: number;
}

export interface ProsodyModel {
  scores: ProsodyScores;
}

export interface MessageContent {
  role: TMessageOwner;
  content: string;
}

export interface Time {
  begin: number;
  end: number;
}

export interface HumeMessage {
  message: MessageContent;
  models?: ProsodyModel;
  time: Time;
}
