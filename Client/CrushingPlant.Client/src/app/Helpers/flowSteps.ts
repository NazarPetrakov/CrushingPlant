import { FlowStep } from '../_models/flowStep';

export const FLOW_STEPS: FlowStep[] = [
  // KKD-11 to Bunker 1
  {
    from: ['path7895'],
    to: ['path7072'],
    animation: 'VIBRATE',
    highlight: ['KKD-11-1'],
  },
  // Bunker 1 to KRD-12 & KRD-13
  {
    from: ['path7072'],
    to: ['path7895-4-7', 'path7895-4-4'],
    animation: 'SPLIT',
    highlight: ['KKD-11-2', 'KKD-11-3'],
  },
  // KRD-12 & KRD-13 to Bunker 2
  {
    from: ['path7895-4-7', 'path7895-4-4'],
    to: ['path6910-8'],
    animation: 'VIBRATE',
    highlight: ['KRD-12-1', 'KRD-13-1'],
  },
  // Bunker 2 to Conveyor K-1
  {
    from: ['path6910-8'],
    to: ['K-1-1'],
    animation: 'SPLIT',
    highlight: ['PIT_14', 'PIT_16'],
  },
  // Conveyor K-1 to Conveyor M-1
  {
    from: ['K-1-1'],
    to: ['M-1-1'],
    animation: 'FLOW',
    highlight: ['K-1-2'],
  },
  // Conveyor M-1 to Bunker 3
  {
    from: ['M-1-1'],
    to: ['path6910-8-6-6'],
    animation: 'FLOW',
    highlight: ['M-1-2'],
  },
  // Bunker 2 to Conveyor K-2
  {
    from: ['path6910-8'],
    to: ['K-2-1'],
    animation: 'SPLIT',
    highlight: ['PIT_15', 'PIT_17'],
  },
  // Conveyor K-2 to Conveyor M-2
  {
    from: ['K-2-1'],
    to: ['M-2-1'],
    animation: 'FLOW',
    highlight: ['K-2-2'],
  },
  // Bunker 3 to KSD crushers
  {
    from: ['path6910-8-6-6'],
    to: ['path7054-0-9', 'path7054-0', 'path7054-0-9-8'],
    animation: 'SPLIT',
    highlight: [
      'PIT_KSD3',
      'PIT_KSD4-2',
      'PIT_KSD6-2',
      'GR-3-1',
      'PIT_KSD4',
      'PIT_KSD6',
    ],
  },
  // KSD crushers to KMD crushers
  {
    from: ['path7054-0-9', 'path7054-0', 'path7054-0-9-8'],
    to: ['path7054-0-9-23', 'path7054-0-9-64', 'path7054-0-9-38'],
    animation: 'VIBRATE',
    highlight: ['GR-3-2', 'GR-4-2', 'GR-6-2'],
  },
  // KMD crushers to Conveyor M-15
  {
    from: ['path7054-0-9-23', 'path7054-0-9-64', 'path7054-0-9-38'],
    to: ['M-15'],
    animation: 'VIBRATE',
  },
  // Conveyor M-15 to loop back
  {
    from: ['M-15'],
    to: ['path7895'],
    animation: 'FLOW',
  },
];
