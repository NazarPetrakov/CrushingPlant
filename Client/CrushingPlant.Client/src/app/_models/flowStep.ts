export type FlowStep = {
  from: string[];
  to: string[];
  animation: 'FLOW' | 'VIBRATE' | 'SPLIT';

  highlight?: string[];
};
