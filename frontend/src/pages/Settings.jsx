import { useState } from "react";

import {
  User,
  Save,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Bell,
  Database,
  Trash2,
  Settings as SettingsIcon,
  Info,
  BarChart3,
  Target,
  Brain,
  CreditCard,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is FinPilot?",
    answer:
      "FinPilot is an AI-powered personal finance decision-support application. It analyzes your financial transactions to identify spending patterns, recurring payments, unusual activity, savings opportunities and financial goals.",
  },
  {
    question: "How does FinPilot analyze my transactions?",
    answer:
      "FinPilot processes your uploaded transaction data, categorizes transactions, calculates income and spending summaries, detects recurring activity and unusual spending, and generates financial insights from those patterns.",
  },
  {
    question: "How are transactions categorized?",
    answer:
      "FinPilot analyzes transaction descriptions and transaction types to assign categories such as Food, Shopping, Transport, Housing, Utilities, Subscription and Income.",
  },
  {
    question: "How are unusual transactions detected?",
    answer:
      "FinPilot compares spending activity with the observed spending pattern in your financial data. Transactions that differ significantly from the usual pattern can be flagged for review.",
  },
  {
    question: "How are recurring payments detected?",
    answer:
      "FinPilot looks for repeated transaction activity that may represent ongoing commitments such as rent, subscriptions, utility payments or other recurring expenses.",
  },
  {
    question: "How are savings opportunities calculated?",
    answer:
      "Savings opportunities are based on category-level spending patterns. FinPilot estimates potential savings when discretionary spending could reasonably be reduced.",
  },
  {
    question: "How does the forecast work?",
    answer:
      "FinPilot uses the transaction history available in the application to identify financial patterns and estimate future spending or financial activity. Forecasts are estimates and should be interpreted alongside your actual financial situation.",
  },
  {
    question: "Does FinPilot make financial decisions for me?",
    answer:
      "No. FinPilot provides analysis, explanations and decision-support suggestions. You remain in control of your financial decisions.",
  },
  {
    question: "Where is my financial data stored?",
    answer:
      "FinPilot currently processes uploaded financial data through the application backend for analysis. The exact storage behavior depends on the configuration of the deployed backend.",
  },
  {
    question: "Can I change my name?",
    answer:
      "Yes. You can change the name displayed throughout your FinPilot dashboard from the Profile section below.",
  },
];

function Settings({ userName, onNameChange }) {
  const [name, setName] = useState(userName || "");

  const [saved, setSaved] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);

  const [currency, setCurrency] = useState(
    localStorage.getItem("finpilotCurrency") || "INR"
  );

  const [dashboardPeriod, setDashboardPeriod] = useState(
    localStorage.getItem("finpilotDashboardPeriod") || "Jun — Sep 2026"
  );

  const [notifications, setNotifications] = useState(() => ({
    unusualSpending:
      localStorage.getItem(
        "finpilotNotifyUnusualSpending"
      ) !== "false",

    recurringPayments:
      localStorage.getItem(
        "finpilotNotifyRecurringPayments"
      ) !== "false",

    goalProgress:
      localStorage.getItem(
        "finpilotNotifyGoalProgress"
      ) !== "false",
  }));

  const [dataMessage, setDataMessage] = useState("");

  const handleSaveProfile = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onNameChange(trimmedName);

    localStorage.setItem(
      "finpilotUserName",
      trimmedName
    );

    setName(trimmedName);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleCurrencyChange = (event) => {
    const value = event.target.value;

    setCurrency(value);

    localStorage.setItem(
      "finpilotCurrency",
      value
    );
  };

  const handlePeriodChange = (event) => {
    const value = event.target.value;

    setDashboardPeriod(value);

    localStorage.setItem(
      "finpilotDashboardPeriod",
      value
    );
  };

  const handleNotificationChange = (
    key,
    value
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: value,
    }));

    const storageKeys = {
      unusualSpending:
        "finpilotNotifyUnusualSpending",

      recurringPayments:
        "finpilotNotifyRecurringPayments",

      goalProgress:
        "finpilotNotifyGoalProgress",
    };

    localStorage.setItem(
      storageKeys[key],
      String(value)
    );
  };

  const toggleFaq = (index) => {
    setOpenFaq(
      openFaq === index
        ? null
        : index
    );
  };

  const handleClearSimulations = () => {
    const confirmed = window.confirm(
      "Clear all saved simulator scenarios?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "finpilotSimulations"
    );

    setDataMessage(
      "Saved simulator scenarios have been cleared."
    );
  };

  const handleClearGoals = () => {
    const confirmed = window.confirm(
      "Clear all saved financial goals?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "finpilotGoals"
    );

    setDataMessage(
      "Saved financial goals have been cleared."
    );
  };

  const handleClearPersonalization = () => {
    const confirmed = window.confirm(
      "Clear your saved FinPilot personalization?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "finpilotUserName"
    );

    setName("");

    onNameChange("");

    setDataMessage(
      "Your saved display name has been cleared."
    );
  };

  return (
    <section className="page-section settings-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <span className="eyebrow">
            FINPILOT SETTINGS
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Manage your FinPilot profile,
            preferences, notifications and data.
          </p>
        </div>
      </div>


      {/* PROFILE */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            <User size={19} />
          </div>

          <div>
            <span className="eyebrow">
              PROFILE
            </span>

            <h2>
              Personalization
            </h2>

            <p>
              Customize how FinPilot addresses you.
            </p>
          </div>

        </div>


        <div className="settings-profile-card">

          <div className="settings-profile-icon">
            <User size={22} />
          </div>

          <div className="settings-profile-content">

            <label htmlFor="finpilot-name">
              Display name
            </label>

            <input
              id="finpilot-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value
                );

                setSaved(false);
              }}
              placeholder="Enter your name"
              maxLength={50}
            />

            <span>
              This name appears in your
              dashboard greeting.
            </span>

          </div>

          <button
            type="button"
            className="settings-save-button"
            onClick={handleSaveProfile}
            disabled={!name.trim()}
          >
            {saved ? (
              <>
                <CheckCircle2 size={17} />
                Saved
              </>
            ) : (
              <>
                <Save size={17} />
                Save
              </>
            )}
          </button>

        </div>

      </section>


      {/* PREFERENCES */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            <SettingsIcon size={19} />
          </div>

          <div>
            <span className="eyebrow">
              PREFERENCES
            </span>

            <h2>
              App preferences
            </h2>

            <p>
              Configure how financial information
              is presented.
            </p>
          </div>

        </div>


        <div className="settings-preferences-card">

          <div className="settings-preference-row">

            <div className="settings-preference-info">

              <strong>
                Currency
              </strong>

              <span>
                Currency used when displaying
                financial amounts.
              </span>

            </div>

            <select
              value={currency}
              onChange={
                handleCurrencyChange
              }
            >
              <option value="INR">
                ₹ INR — Indian Rupee
              </option>

              <option value="USD">
                $ USD — US Dollar
              </option>

              <option value="EUR">
                € EUR — Euro
              </option>

              <option value="GBP">
                £ GBP — British Pound
              </option>
            </select>

          </div>


          <div className="settings-preference-divider" />


          <div className="settings-preference-row">

            <div className="settings-preference-info">

              <strong>
                Dashboard period
              </strong>

              <span>
                Select the reporting period
                displayed in the dashboard.
              </span>

            </div>

            <select
              value={dashboardPeriod}
              onChange={
                handlePeriodChange
              }
            >
              <option>
                Jun — Sep 2026
              </option>

              <option>
                Jan — Sep 2026
              </option>

              <option>
                Last 3 months
              </option>

              <option>
                Last 6 months
              </option>
            </select>

          </div>

        </div>

      </section>


      {/* NOTIFICATIONS */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            <Bell size={19} />
          </div>

          <div>
            <span className="eyebrow">
              NOTIFICATIONS
            </span>

            <h2>
              Financial alerts
            </h2>

            <p>
              Control the financial alerts
              you want FinPilot to prepare.
            </p>
          </div>

        </div>


        <div className="settings-notification-card">

          <div className="settings-toggle-row">

            <div className="settings-toggle-info">

              <strong>
                Unusual spending
              </strong>

              <span>
                Alert when FinPilot identifies
                potentially unusual transactions.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  notifications.unusualSpending
                }
                onChange={(event) =>
                  handleNotificationChange(
                    "unusualSpending",
                    event.target.checked
                  )
                }
              />

              <span />
            </label>

          </div>


          <div className="settings-preference-divider" />


          <div className="settings-toggle-row">

            <div className="settings-toggle-info">

              <strong>
                Recurring payments
              </strong>

              <span>
                Show reminders related to
                recurring financial commitments.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  notifications.recurringPayments
                }
                onChange={(event) =>
                  handleNotificationChange(
                    "recurringPayments",
                    event.target.checked
                  )
                }
              />

              <span />
            </label>

          </div>


          <div className="settings-preference-divider" />


          <div className="settings-toggle-row">

            <div className="settings-toggle-info">

              <strong>
                Goal progress
              </strong>

              <span>
                Keep goal progress reminders
                enabled.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  notifications.goalProgress
                }
                onChange={(event) =>
                  handleNotificationChange(
                    "goalProgress",
                    event.target.checked
                  )
                }
              />

              <span />
            </label>

          </div>

        </div>

      </section>


      {/* FINPILOT INTELLIGENCE */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            <Brain size={19} />
          </div>

          <div>
            <span className="eyebrow">
              FINPILOT INTELLIGENCE
            </span>

            <h2>
              How FinPilot works
            </h2>

            <p>
              Understand the intelligence behind
              your financial analysis.
            </p>
          </div>

        </div>


        <div className="settings-info-section">

          <div className="settings-info-card">

            <div className="settings-info-icon">
              <CreditCard size={20} />
            </div>

            <div>
              <h3>
                Transaction analysis
              </h3>

              <p>
                Uploaded transactions are
                categorized and analyzed to
                calculate income, spending,
                savings and financial patterns.
              </p>
            </div>

          </div>


          <div className="settings-info-card">

            <div className="settings-info-icon">
              <BarChart3 size={20} />
            </div>

            <div>
              <h3>
                Insights & anomalies
              </h3>

              <p>
                FinPilot identifies recurring
                activity, unusual transactions
                and category-level spending
                opportunities.
              </p>
            </div>

          </div>


          <div className="settings-info-card">

            <div className="settings-info-icon">
              <Target size={20} />
            </div>

            <div>
              <h3>
                Goals & simulations
              </h3>

              <p>
                Goals and what-if scenarios help
                you explore how changes in
                spending or savings can affect
                future targets.
              </p>
            </div>

          </div>


          <div className="settings-info-card">

            <div className="settings-info-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <h3>
                Decision support
              </h3>

              <p>
                FinPilot provides explanations
                and suggestions while leaving
                financial decisions under your
                control.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* PRIVACY & DATA */}

      <section className="settings-section">

        <div className="settings-section-header">

          <div className="settings-section-icon">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span className="eyebrow">
              PRIVACY & DATA
            </span>

            <h2>
              Manage your data
            </h2>

            <p>
              Control locally saved FinPilot
              information.
            </p>
          </div>

        </div>


        <div className="settings-data-card">

          <div className="settings-data-row">

            <div className="settings-data-icon">
              <Database size={19} />
            </div>

            <div className="settings-data-info">

              <strong>
                Saved simulator scenarios
              </strong>

              <span>
                Remove scenarios saved in
                this browser.
              </span>

            </div>

            <button
              type="button"
              className="settings-danger-button"
              onClick={
                handleClearSimulations
              }
            >
              <Trash2 size={16} />
              Clear
            </button>

          </div>


          <div className="settings-preference-divider" />


          <div className="settings-data-row">

            <div className="settings-data-icon">
              <Target size={19} />
            </div>

            <div className="settings-data-info">

              <strong>
                Saved financial goals
              </strong>

              <span>
                Remove locally saved goals
                from this browser.
              </span>

            </div>

            <button
              type="button"
              className="settings-danger-button"
              onClick={
                handleClearGoals
              }
            >
              <Trash2 size={16} />
              Clear
            </button>

          </div>


          <div className="settings-preference-divider" />


          <div className="settings-data-row">

            <div className="settings-data-icon">
              <User size={19} />
            </div>

            <div className="settings-data-info">

              <strong>
                Personalization
              </strong>

              <span>
                Remove your locally saved
                display name.
              </span>

            </div>

            <button
              type="button"
              className="settings-danger-button"
              onClick={
                handleClearPersonalization
              }
            >
              <Trash2 size={16} />
              Clear
            </button>

          </div>

        </div>


        {dataMessage && (
          <div className="settings-data-message">
            <CheckCircle2 size={16} />

            <span>
              {dataMessage}
            </span>
          </div>
        )}

      </section>


      {/* FAQ */}

      <section className="settings-faq-section">

        <div className="settings-faq-header">

          <div>

            <span className="eyebrow">
              FAQ
            </span>

            <h2>
              Frequently asked questions
            </h2>

            <p>
              Learn more about FinPilot's
              features and analysis.
            </p>

          </div>

          <div className="settings-faq-icon">
            <HelpCircle size={21} />
          </div>

        </div>


        <div className="settings-faq-list">

          {FAQ_ITEMS.map(
            (item, index) => {

              const isOpen =
                openFaq === index;

              return (
                <div
                  className={`settings-faq-item ${
                    isOpen
                      ? "open"
                      : ""
                  }`}
                  key={item.question}
                >

                  <button
                    type="button"
                    className="settings-faq-question"
                    onClick={() =>
                      toggleFaq(index)
                    }
                    aria-expanded={isOpen}
                  >

                    <span>
                      {item.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={
                        isOpen
                          ? "rotated"
                          : ""
                      }
                    />

                  </button>


                  {isOpen && (
                    <div className="settings-faq-answer">

                      <p>
                        {item.answer}
                      </p>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* ABOUT */}

      <section className="settings-about-section">

        <div className="settings-about-icon">
          <Info size={20} />
        </div>

        <div>

          <span className="eyebrow">
            ABOUT FINPILOT
          </span>

          <h3>
            FinPilot
          </h3>

          <p>
            AI-powered personal finance
            decision support for understanding
            spending, planning goals and exploring
            financial possibilities.
          </p>

          <span className="settings-version">
            Version 1.0.0
          </span>

        </div>

      </section>

    </section>
  );
}

export default Settings;