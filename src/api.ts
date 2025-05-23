// src/api.ts
import axios from "axios";

const API_BASE = "/api/users";

/**
 * Join a device by ID with the given password.
 * @param deviceId The ID of the device to join.
 * @param password The device’s join password.
 * @returns The API response body.
 */
export async function joinDevice(deviceId: string, password: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not logged in");
  }

  const response = await axios.post(
    `/api/devices/${encodeURIComponent(deviceId)}/join`,
    { password },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function login(username: string, password: string): Promise<string> {
  const res = await axios.post(`${API_BASE}/login`, { username, password });
  return res.data.token;
}

export async function register(username: string, password: string): Promise<void> {
  await axios.post(`${API_BASE}/register`, { username, password });
}

// New: fetch user devices
export interface Device {
  id: number;
  name: string;
}
export async function getDevices(): Promise<Device[]> {
  const token = localStorage.getItem("token");
  const res = await axios.get(`/api/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// New: upload a sound file to a specific device
export async function uploadSound(deviceId: number, file: File): Promise<void> {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  // Name field matches backend expectation 'soundFile'
  formData.append("soundFile", file);

  await axios.post(
    `/api/devices/${deviceId}/sounds`,
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
  type: "warning" | "vibrate";
  timestamp: string;    // ISO-8601 string
}

/** Fetch all commands for a device */
export async function getDeviceCommands(deviceId: number): Promise<Command[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await axios.get<Command[]>(
    `${API_BASE}/devices/${deviceId}/commands`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function sendDeviceCommand(
  deviceId: number,
  type: "warning" | "vibrate"
): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  await axios.post(
    `/api/devices/${deviceId}/commands`,
    { type },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}