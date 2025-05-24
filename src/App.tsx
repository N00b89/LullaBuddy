// src/App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import {
  requestNotificationPermission,
  listenToForegroundMessages,
} from "./firebase-messaging";

import { login, register } from "./api";
import { Button } from "./components/ui/button";
import BluetoothProvisioning from "./bluetooth";
import DeviceControl from "./CommandListener";
import SleepPatternGraph from "./SleepPatternGraph";
import SoundsPage from "./Sounds";
import CommandListener from "./CommandListener";
import LandingPage from "./LandingPage";
import TestModePage from "./TestmodePage";
import TestIntroPage from "./TestIntroPage";
import { useCommandChecker } from "./useCommandChecker";

import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Switch } from "@headlessui/react";

import homeIcon     from "./assets/home.png";
import soundsIcon   from "./assets/sounds.png";
import insightsIcon from "./assets/insights.png";
import settingsIcon from "./assets/settings.png";

import "./App.css";

export function Home() {
  const [soundOn, setSoundOn] = useState(false);

  return (
    <div className="page-wrap page-center home-screen skew-wrap">
      <div className="avatar" />
      <h2 className="sleep-label">your kid is sleeping</h2>
      <h3 className="timer">1:00:00</h3>

      <div className="toggle-row">
        <span className="toggle-label">Sound</span>
        <div className="switch-on">
          <Switch checked={soundOn} onChange={setSoundOn} />
        </div>
      </div>

      <button className="btn end-btn">End</button>
    </div>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await login(username, pw);
      onDone();
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrap page-center page-wrap">
      <button onClick={() => history.back()} className="arrow-btn self-start text-2xl ml-3">←</button>
      <div className="auth-avatar" />
      <h2 className="auth-title">Log In</h2>

      <Card className="auth-card">
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              placeholder="Username"
              className="auth-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              className="auth-input"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />

            <Button className="auth-btn-primary">Log In</Button>
            {err && <p className="text-red-500 text-xs mt-2">{err}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw]       = useState("");
  const [info, setInfo]   = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo("");
    try {
      await register(email, pw);
      onDone();
    } catch (e: any) {
      setInfo(e.response?.data?.message || e.message || "Failed");
    }
  };

  return (
    <div className="auth-wrap page-center page-wrap">
      <button onClick={() => history.back()} className="arrow-btn self-start text-2xl ml-3">←</button>
      <div className="auth-avatar" />
      <h2 className="auth-title">Sign Up</h2>

      <Card className="auth-card">
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              className="auth-input"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />

            <Button className="auth-btn-primary">Create account</Button>
            {info && <p className="text-xs mt-2">{info}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState<"anon" | "intro" | "auth">("anon");
  const { status, debug } = useCommandChecker();

  useEffect(() => {
    if (stage === "auth") {
      requestNotificationPermission().catch(console.error);
      listenToForegroundMessages();
    }
  }, [stage]);

  return (
    <Router>
      {stage === "intro" ? (
        <Routes>
          <Route path="*" element={<TestIntroPage onContinue={() => setStage("auth")} />} />
        </Routes>
      ) : stage === "auth" ? (
        <>
          <CommandListener />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sounds" element={<SoundsPage />} />
            <Route path="/insights" element={<SleepPatternGraph />} />
            <Route path="/settings" element={<BluetoothProvisioning />} />
            <Route path="/control" element={<DeviceControl />} />
            <Route path="/test-mode" element={<TestModePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <nav className="tab-bar">
            <NavLink to="/" end className="tab-btn"><img src={homeIcon} className="icon-img" /><span className="label">Home</span></NavLink>
            <NavLink to="/sounds" className="tab-btn"><img src={soundsIcon} className="icon-img" /><span className="label">Sounds</span></NavLink>
            <NavLink to="/insights" className="tab-btn"><img src={insightsIcon} className="icon-img" /><span className="label">Insights</span></NavLink>
            <NavLink to="/settings" className="tab-btn"><img src={settingsIcon} className="icon-img" /><span className="label">Settings</span></NavLink>
          </nav>

          <div className="debug-box">Debug: {debug} {status && <strong>{status}</strong>}</div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm onDone={() => setStage("intro")} />} />
          <Route path="/register" element={<RegisterForm onDone={() => setStage("intro")} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}
