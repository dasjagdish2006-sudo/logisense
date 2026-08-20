export type ProbeState = "idle" | "checking" | "ok" | "error";

export interface HealthResponse {
  status: string;
}

export interface SystemStatusResponse {
  success: boolean;
  data: {
    service: string;
    version: string;
    environment: string;
    phase: number;
    phase_name: string;
    timestamp: string;
  };
}
