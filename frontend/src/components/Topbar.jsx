import {
  Bell,
  Search,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

function Topbar({ userName }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <span className="eyebrow">
          PERSONAL FINANCE
        </span>

        <h2>
          Good morning, {userName || "there"}
        </h2>
      </div>

      <div className="topbar-actions">
        {/* Search */}
        <button
          type="button"
          className="icon-button"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        {/* Date selector */}
        <button
          type="button"
          className="period-selector"
        >
          <CalendarDays size={17} />

          <span>
            Jun — Sep 2026
          </span>

          <ChevronDown size={15} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="icon-button notification"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span />
        </button>
      </div>
    </header>
  );
}

export default Topbar;