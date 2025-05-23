import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from "./firebase-config.ts";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Call this in your app
export async function requestNotificationPermission(): Promise<string> {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error("Notification permission not granted");
  }

  const token = await getToken(messaging, {
    vapidKey: "BPBll7QCVkKeWIrgdwsCeNeSsltlsfuIatXwWXHAb2-mqfgtXiVexB_AVb3EcZZPISv6NoDL4GDb_qz_QFUBF2g",
  });

  console.log("🔔 FCM Token:", token);
  return token;
}

export function listenToForegroundMessages() {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message received:", payload);
    const { title, body } = payload.notification || {};
    new Notification(title || "New Message", {
      body: body || "",
    });
  });
}
