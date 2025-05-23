// src/api.ts
import axios from "axios";

const API_BASE = "/api/users"; // this stays unchanged

const DEVICE_BASE = import.meta.env.PROD
  ? "https://theta.proto.aalto.fi/api/devices"
  : "/api/devices";

/**
 * Join a device by ID with the given password.
 */
export async function joinDevice(deviceId: string, password: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not logged in");

  const res = await axios.post(
    `${DEVICE_BASE}/${encodeURIComponent(deviceId)}/join`,
    { password },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function login(username: string, password: string): Promise<string> {
  const res = await axios.post(`${API_BASE}/login`, { username, password });
  return res.data.token;
}

export async function register(username: string, password: string): Promise<void> {
  await axios.post(`${API_BASE}/register`, { username, password });
}

export interface Device {
  id: number;
  name: string;
}

export async function getDevices(): Promise<Device[]> {
  const token = localStorage.getItem("token");
  const res = await axios.get(DEVICE_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function uploadSound(deviceId: number, file: File): Promise<void> {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("soundFile", file);

  await axios.post(
    `${DEVICE_BASE}/${deviceId}/sounds`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export interface Command {
  type: "warning" | "vibrate" | "silent";
  timestamp: string;
}

export async function getDeviceCommands(deviceId: number): Promise<Command[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await axios.get<Command[]>(
    `${DEVICE_BASE}/${deviceId}/commands`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function sendDeviceCommand(
  deviceId: number,
  type: "warning" | "vibrate" | "silent" | "notification"
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  await axios.post(
    `${DEVICE_BASE}/${deviceId}/commands`,
    { type },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
