import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  TrendingUp,
  Target,
  Sparkles,
  Settings,
  Upload,
  WalletCards,
  Wallet,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  onUpload,
}) {
  const menuItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      label: "Transactions",
      icon: ArrowLeftRight,
    },
    {
      label: "Budgets",
      icon: Wallet,
    },
    {
      label: "Insights",
      icon: Lightbulb,
    },
    {
      label: "Forecast",
      icon: TrendingUp,
    },
    {
      label: "Copilot",
      icon: Sparkles,
    },
    {
      label: "Goals",
      icon: Target,
    },
    {
      label: "Simulator",
      icon: Sparkles,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <WalletCards size={21} />
        </div>

        <div className="brand-text">
          <h1>FinPilot</h1>

          <span>Financial Copilot</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-label">
          Workspace
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`nav-item ${
                activePage === item.label
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(item.label)
              }
            >
              <Icon size={19} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <button
          className="upload-button"
          onClick={onUpload}
        >
          <Upload size={18} />

          <span>Import statement</span>
        </button>

        <button
          className={`nav-item ${
            activePage === "settings"
              ? "active"
              : ""
          }`}
          onClick={() => setActivePage("settings")}
        >
          <Settings size={19} />

          <span>Settings</span>
        </button>

        <div className="profile">
          <div className="avatar">
            A
          </div>

          <div className="profile-info">
            <strong>Arbiya</strong>

            <span>Personal account</span>
          </div>

          <div className="online-dot" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;