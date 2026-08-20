import axios from "axios";
import type { HealthResponse, SystemStatusResponse } from "../types/health";

const client = axios.create({
  timeout: 6000,
});

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await client.get<HealthResponse>("/health");
  return data;
}

export async function fetchSystemStatus(): Promise<SystemStatusResponse> {
  const { data } = await client.get<SystemStatusResponse>("/api/v1/system/status");
  return data;
}
