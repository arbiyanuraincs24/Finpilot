import { useState } from "react";
import {
  ArrowLeft,
  Target,
  CalendarDays,
  Wallet,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function CreateGoal({
  onBack,
  onCreate,
}) {
  const [goalName, setGoalName] =
    useState("");

  const [targetAmount, setTargetAmount] =
    useState("");

  const [currentAmount, setCurrentAmount] =
    useState("");

  const [targetDate, setTargetDate] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const name =
      goalName.trim();

    const target =
      Number(targetAmount);

    const current =
      Number(currentAmount || 0);

    if (!name) {
      setError(
        "Please enter a goal name."
      );
      return;
    }

    if (
      !Number.isFinite(target) ||
      target <= 0
    ) {
      setError(
        "Please enter a valid target amount."
      );
      return;
    }

    if (
      !Number.isFinite(current) ||
      current < 0
    ) {
      setError(
        "Please enter a valid current amount."
      );
      return;
    }

    if (current > target) {
      setError(
        "Current amount cannot be greater than the target."
      );
      return;
    }

    if (!targetDate) {
      setError(
        "Please select a target date."
      );
      return;
    }

    const selectedDate =
      new Date(targetDate);

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      Number.isNaN(
        selectedDate.getTime()
      ) ||
      selectedDate <= today
    ) {
      setError(
        "Target date must be in the future."
      );
      return;
    }

    onCreate({
      name,
      targetAmount: target,
      currentAmount: current,
      targetDate,
    });
  };

  return (
    <div className="create-goal-page">

      <button
        className="goal-back-button"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="create-goal-header">

        <span className="eyebrow">
          CREATE GOAL
        </span>

        <h1>
          What are you planning for?
        </h1>

        <p>
          Define your target and FinPilot
          will help you understand the
          monthly saving required.
        </p>

      </div>

      <form
        className="create-goal-form"
        onSubmit={handleSubmit}
      >

        {/* NAME */}

        <div className="goal-form-field">

          <label htmlFor="goal-name">
            Goal name
          </label>

          <div className="goal-input-wrapper">

            <Target size={18} />

            <input
              id="goal-name"
              type="text"
              placeholder="Example: New laptop"
              value={goalName}
              onChange={(event) =>
                setGoalName(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* TARGET */}

        <div className="goal-form-field">

          <label htmlFor="target-amount">
            Target amount
          </label>

          <div className="goal-input-wrapper">

            <span className="rupee-symbol">
              ₹
            </span>

            <input
              id="target-amount"
              type="number"
              min="1"
              placeholder="100000"
              value={targetAmount}
              onChange={(event) =>
                setTargetAmount(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* CURRENT */}

        <div className="goal-form-field">

          <label htmlFor="current-amount">
            Already saved
          </label>

          <div className="goal-input-wrapper">

            <Wallet size={18} />

            <input
              id="current-amount"
              type="number"
              min="0"
              placeholder="0"
              value={currentAmount}
              onChange={(event) =>
                setCurrentAmount(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* DATE */}

        <div className="goal-form-field">

          <label htmlFor="target-date">
            Target date
          </label>

          <div className="goal-input-wrapper">

            <CalendarDays
              size={18}
            />

            <input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(event) =>
                setTargetDate(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="goal-form-error">

            <AlertCircle
              size={17}
            />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* SUBMIT */}

        <button
          className="goal-submit-button"
          type="submit"
        >
          Save goal
          <ArrowRight size={18} />
        </button>

      </form>

    </div>
  );
}

export default CreateGoal;