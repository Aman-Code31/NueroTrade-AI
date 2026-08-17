import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import Landing from "./Landing.jsx";
import AuthScreen from "./AuthScreen.jsx";
import AppNav from "./AppNav.jsx";
import Dashboard from "./Dashboard.jsx";
import Profile from "./Profile.jsx";

const App = () => {
  const { user, authLoading } = useAuth();
  const [view, setView] = useState("landing"); // landing | auth | dashboard | profile

  // Once a session resolves, route accordingly. Only fires on actual auth
  // state transitions (login/logout), not every render.
  useEffect(() => {
    if (authLoading) return;
    if (user && (view === "landing" || view === "auth")) {
      setView("dashboard");
    }
    if (!user && (view === "dashboard" || view === "profile")) {
      setView("landing");
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-sm text-inksoft">
        Loading…
      </div>
    );
  }

  if (!user) {
    if (view === "auth") return <AuthScreen onBack={() => setView("landing")} />;
    return <Landing onEnter={() => setView("auth")} />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <AppNav view={view} setView={setView} />
      {view === "profile" ? <Profile /> : <Dashboard />}
    </div>
  );
};

export default App;
