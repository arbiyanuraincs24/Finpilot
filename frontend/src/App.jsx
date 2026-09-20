import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [showDashboard, setShowDashboard] =
    useState(false);

  const [showNameSetup, setShowNameSetup] =
    useState(false);

  const [userName, setUserName] =
    useState("");

  /* =========================================
     GET STARTED
  ========================================= */

 const handleGetStarted = () => {
  console.log("GET STARTED CLICKED");

  const savedName =
    localStorage.getItem("finpilotUserName");

  console.log("SAVED NAME:", savedName);

  if (savedName && savedName.trim()) {
    setUserName(savedName);
    setShowDashboard(true);
    return;
  }

  console.log("OPENING NAME SETUP");

  setShowNameSetup(true);
};

  /* =========================================
     SAVE NAME
  ========================================= */

  const handleNameSubmit = (event) => {
    event.preventDefault();

    const trimmedName =
      userName.trim();

    if (!trimmedName) {
      return;
    }

    localStorage.setItem(
      "finpilotUserName",
      trimmedName
    );

    setUserName(trimmedName);
    setShowNameSetup(false);
    setShowDashboard(true);
  };

  /* =========================================
     DASHBOARD
  ========================================= */

  if (showDashboard) {
    return (
      <Dashboard
        userName={userName}
        onNameChange={setUserName}
      />
    );
  }

  /* =========================================
     LANDING PAGE
  ========================================= */

  return (
    <>
      <LandingPage
        onGetStarted={handleGetStarted}
      />

      {showNameSetup && (
        <div className="finpilot-name-overlay">
          <div className="finpilot-name-modal">

            <div className="finpilot-name-icon">
              ✦
            </div>

            <span className="eyebrow">
              PERSONAL FINANCE
            </span>

            <h2>
              What should we call you?
            </h2>

            <p>
              We'll use your name to personalize
              your FinPilot experience.
            </p>

            <form onSubmit={handleNameSubmit}>

              <label htmlFor="user-name">
                Your name
              </label>

              <input
                id="user-name"
                type="text"
                value={userName}
                onChange={(event) =>
                  setUserName(
                    event.target.value
                  )
                }
                placeholder="Enter your name"
                maxLength={50}
                autoFocus
              />

              <button
                type="submit"
                disabled={!userName.trim()}
              >
                Continue to FinPilot
              </button>

            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default App;