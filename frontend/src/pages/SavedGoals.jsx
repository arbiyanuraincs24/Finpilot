import {
  Target,
  ArrowRight,
  Plus,
  Trash2,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

/* =========================================================
   SAVED GOALS
========================================================= */

function SavedGoals({
  savedGoals = [],
  onSelectGoal,
  onCreateGoal,
  onDeleteGoal,
  onBack,
}) {
  return (
    <div className="saved-goals-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="saved-goals-header">

        <div className="saved-goals-heading">

          <button
            className="saved-goals-back"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft size={17} />
            Goals
          </button>

          <span className="eyebrow">
            SAVED GOALS
          </span>

          <h1>
            Your financial goals.
          </h1>

          <p>
            Every goal you create is saved here
            so you can return to it anytime.
          </p>

        </div>

        <button
          className="goal-create-button"
          onClick={onCreateGoal}
          type="button"
        >
          <Plus size={17} />
          Create goal
        </button>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {savedGoals.length === 0 && (
        <section className="saved-goals-empty">

          <div className="saved-goals-empty-icon">
            <Target size={30} />
          </div>

          <h2>
            No saved goals yet
          </h2>

          <p>
            Create your first financial goal
            and it will appear here automatically.
          </p>

          <button
            className="goal-create-button"
            onClick={onCreateGoal}
            type="button"
          >
            <Plus size={17} />
            Create your first goal
          </button>

        </section>
      )}

      {/* =================================================
          SAVED GOALS
      ================================================= */}

      {savedGoals.length > 0 && (
        <section className="saved-goals-list-section">

          <div className="saved-goals-section-heading">

            <div>
              <h2>
                Your goals
              </h2>

              <p>
                Click any goal to open its plan.
              </p>
            </div>

            <span>
              {savedGoals.length}{" "}
              {savedGoals.length === 1
                ? "goal"
                : "goals"}
            </span>

          </div>

          <div className="saved-goals-list">

            {savedGoals.map((goal) => {

              const target =
                Number(
                  goal.targetAmount
                ) || 0;

              const current =
                Number(
                  goal.currentAmount
                ) || 0;

              const progress =
                target > 0
                  ? Math.min(
                      (current /
                        target) *
                        100,
                      100
                    )
                  : 0;

              const remaining =
                Math.max(
                  target - current,
                  0
                );

              return (
                <div
                  className="saved-goal-row"
                  key={goal.id}
                >

                  {/* CLICKABLE GOAL */}

                  <button
                    className="saved-goal-row-main"
                    onClick={() =>
                      onSelectGoal(
                        goal
                      )
                    }
                    type="button"
                  >

                    <div className="saved-goal-row-icon">
                      <Target size={21} />
                    </div>

                    <div className="saved-goal-row-content">

                      <div className="saved-goal-row-title">

                        <h3>
                          {goal.name}
                        </h3>

                        <span>
                          {Math.round(
                            progress
                          )}
                          %
                        </span>

                      </div>

                      <div className="saved-goal-row-progress">

                        <div
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                      <div className="saved-goal-row-details">

                        <span>
                          {formatCurrency(
                            current
                          )}{" "}
                          saved
                        </span>

                        <span>
                          {formatCurrency(
                            remaining
                          )}{" "}
                          remaining
                        </span>

                      </div>

                    </div>

                    <div className="saved-goal-row-target">

                      <strong>
                        {formatCurrency(
                          target
                        )}
                      </strong>

                      <span>
                        target
                      </span>

                    </div>

                    <div className="saved-goal-row-date">

                      <CalendarDays
                        size={15}
                      />

                      <span>
                        {goal.targetDate}
                      </span>

                    </div>

                    <div className="saved-goal-row-arrow">
                      <ArrowRight
                        size={18}
                      />
                    </div>

                  </button>

                  {/* DELETE */}

                  <button
                    className="saved-goal-row-delete"
                    type="button"
                    title="Delete goal"
                    onClick={() =>
                      onDeleteGoal(
                        goal.id
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              );
            })}

          </div>

        </section>
      )}

    </div>
  );
}

export default SavedGoals;