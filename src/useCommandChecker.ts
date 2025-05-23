// src/useCommandChecker.ts – polls command endpoint every 5 s
import { useEffect, useState } from "react";

export interface CommandEnvelope {
  id?: number;                 // if API returns flat
  command: any;                // could be string or object
  message?: string;
}

export function useCommandChecker(): { status: string | null; debug: string } {
  const [status, setStatus] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>("Waiting for first check…");

  useEffect(() => {
    let isMounted = true;
    let lastId: number | null = null;

    const poll = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setDebug("⚠️ No JWT token in localStorage");
        return;
      }

      try {
        if (isMounted) setDebug("🔄 Polling /commands…");
        const res = await fetch(
          "https://theta.proto.aalto.fi/api/devices/1/commands",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 204 No Content → nothing to parse
        if (res.status === 204) {
          if (isMounted) setDebug("ℹ️ No new command (204 – empty)");
          return;
        }

        if (!res.ok) {
          if (isMounted) setDebug(`🚫 Server responded ${res.status}`);
          return;
        }

        const data = (await res.json()) as CommandEnvelope;
        console.log("API payload", data);

        /* ---- handle both possible shapes ---- */
        let cmdName: string | undefined;
        let cmdId: number | undefined;

        if (typeof data.command === "string") {
          // shape: { command: "notification" }
          cmdName = data.command;
          cmdId = data.id; // might be undefined
        } else if (data.command && typeof data.command === "object") {
          // shape: { command: { id, deviceId, command:"notification" } }
          cmdName = data.command.command;
          cmdId = data.command.id;
        }

        if (!cmdName) {
          if (isMounted) setDebug("ℹ️ No parsable command in payload");
          return;
        }

        // avoid duplicate processing
        if (cmdId !== undefined && cmdId === lastId) return;
        if (cmdId !== undefined) lastId = cmdId;

        if (isMounted) setDebug(`📦 Received command: ${cmdName}`);

        if (cmdName === "notification") {
          console.log("tung tung tung sahur");
          if (Notification.permission === "granted") {
            new Notification("LullaBuddy", {
              body: "tung tung tung sahur",
              icon: "/icon.png",
            });
          }
          if (isMounted)
            setStatus(`✅ Notification cmd @ ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        if (isMounted) setDebug(`❌ Fetch error: ${(err as Error).message}`);
        console.error(err);
      }
    };

    poll();
    const id = setInterval(poll, 5000);

    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  return { status, debug };
}
