export interface CrusherMetrics {
  equipmentId: string;
  temperature?: number | null;
  load?: number | null;
  power?: number | null;
  feedingSize?: number | null;
  dischargeSize?: number | null;
  metricsUpdatedAt?: Date | null;
}

export interface ConveyorMetrics {
  equipmentId: string;
  speed?: number | null;
  metricsUpdatedAt?: Date | null;
}

export interface BunkerMetrics {
  equipmentId: string;
  level?: number | null;
  capacity?: number | null;
  metricsUpdatedAt?: Date | null;
}
