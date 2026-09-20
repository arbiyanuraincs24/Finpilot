import { useState } from "react";

import {
  Sparkles,
  Send,
  User,
  Bot,
  TrendingUp,
  PiggyBank,
  Wallet,
  Repeat,
  ShoppingBag,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";

import { askCopilot } from "../api";


function Copilot({
  transactions = [],
  summary = {},
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


  const suggestions = [
    {
      label: "Spending",
      question: "Where am I spending the most?",
      icon: TrendingUp,
    },
    {
      label: "Savings",
      question: "How much am I saving?",
      icon: PiggyBank,
    },
    {
      label: "Income",
      question: "What is my income source?",
      icon: Wallet,
    },
    {
      label: "Subscriptions",
      question: "How much did I spend on subscriptions?",
      icon: Repeat,
    },
    {
      label: "Netflix",
      question: "How much did I spend on Netflix?",
      icon: CalendarClock,
    },
    {
      label: "Shopping",
      question: "How much did I spend on shopping?",
      icon: ShoppingBag,
    },
    {
      label: "Budget",
      question: "How can I manage my income and expenses?",
      icon: Wallet,
    },
    {
      label: "Recurring",
      question: "What are my biggest recurring payments?",
      icon: Repeat,
    },
  ];


  const handleAsk = async (
    selectedQuestion = question
  ) => {

    const trimmedQuestion =
      selectedQuestion.trim();

    if (!trimmedQuestion || loading) {
      return;
    }


    if (transactions.length === 0) {

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Upload a financial statement first, and I'll be able to analyze your finances.",
        },
      ]);

      return;
    }


    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);


    setQuestion("");
    setLoading(true);


    try {

      const result = await askCopilot(
        trimmedQuestion,
        transactions,
        summary
      );


      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.answer,
          type: result.type,
          source: result.source,
        },
      ]);

    } catch (error) {

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message ||
            "I couldn't analyze that right now.",
        },
      ]);

    } finally {

      setLoading(false);

    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    handleAsk();
  };


  const handleSuggestion = (
    suggestion
  ) => {

    handleAsk(
      suggestion.question
    );
  };


  return (
    <section className="page-section copilot-page">

      <div className="page-header">

        <div>

          <span className="eyebrow">
            FINPILOT AI
          </span>

          <h1>
            Your financial copilot.
          </h1>

          <p>
            Ask questions about your money and get
            answers based on your uploaded transactions.
          </p>

        </div>


        <div className="insights-badge">

          <Sparkles size={17} />

          <span>
            Financial intelligence
          </span>

        </div>

      </div>


      <div className="copilot-layout">

        <div className="copilot-main">

          <div className="copilot-card">


            {messages.length === 0 ? (

              <div className="copilot-empty">

                <div className="copilot-orb">
                  <Sparkles size={28} />
                </div>

                <h2>
                  What would you like to know?
                </h2>

                <p>
                  Ask FinPilot anything about your
                  income, spending, savings or
                  recurring payments.
                </p>

              </div>

            ) : (

              <div className="copilot-messages">

                {messages.map(
                  (message, index) => (

                    <div
                      className={`copilot-message ${
                        message.role
                      }`}
                      key={index}
                    >

                      <div className="message-avatar">

                        {message.role ===
                        "user" ? (
                          <User size={16} />
                        ) : (
                          <Bot size={17} />
                        )}

                      </div>


                      <div className="message-content">

                        <span className="message-label">

                          {message.role ===
                          "user"
                            ? "You"
                            : "FinPilot"}

                        </span>


                        <p>
                          {message.content}
                        </p>


                        {message.source && (
                          <span className="message-source">

                            <span className="source-dot" />

                            Based on transaction analysis

                          </span>
                        )}

                      </div>

                    </div>

                  )
                )}


                {loading && (

                  <div className="copilot-message assistant">

                    <div className="message-avatar">
                      <Bot size={17} />
                    </div>

                    <div className="message-content">

                      <span className="message-label">
                        FinPilot
                      </span>

                      <div className="typing-indicator">
                        <span />
                        <span />
                        <span />
                      </div>

                    </div>

                  </div>

                )}

              </div>

            )}


            <div className="copilot-suggestions-section">

              <div className="suggestions-heading">

                <span>
                  TRY ASKING
                </span>

                <Sparkles size={14} />

              </div>


              <div className="copilot-suggestions">

                {suggestions.map(
                  (suggestion) => {

                    const Icon =
                      suggestion.icon;


                    return (
                      <button
                        key={suggestion.label}
                        className="copilot-suggestion"
                        onClick={() =>
                          handleSuggestion(
                            suggestion
                          )
                        }
                        disabled={loading}
                      >

                        <div className="suggestion-icon">

                          <Icon size={16} />

                        </div>

                        <span>
                          {suggestion.question}
                        </span>

                        <ArrowUpRight
                          size={14}
                          className="suggestion-arrow"
                        />

                      </button>
                    );

                  }
                )}

              </div>

            </div>


            <form
              className="copilot-input-area"
              onSubmit={handleSubmit}
            >

              <div className="copilot-input-wrapper">

                <Sparkles size={18} />

                <input
                  type="text"
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value
                    )
                  }
                  placeholder="Ask FinPilot about your finances..."
                  disabled={loading}
                />


                <button
                  type="submit"
                  disabled={
                    !question.trim() ||
                    loading
                  }
                  aria-label="Ask FinPilot"
                >

                  <Send size={17} />

                </button>

              </div>

            </form>

          </div>

        </div>


        <aside className="copilot-sidebar">

          <div className="copilot-info-card">

            <div className="copilot-info-icon">

              <Sparkles size={20} />

            </div>


            <span className="eyebrow">
              ASK FINPILOT
            </span>


            <h3>
              Make your financial data useful.
            </h3>


            <p>
              FinPilot uses AI to understand your
              financial activity and answer questions
              using your actual transactions.
            </p>


            <div className="copilot-ai-status">

              <span className="ai-status-dot" />

              <span>
                AI Copilot online
              </span>

            </div>

          </div>


          <div className="copilot-data-card">

            <div className="data-card-heading">

              <span className="eyebrow">
                CURRENT DATA
              </span>

              <span className="data-live">
                LIVE
              </span>

            </div>


            <div className="copilot-data-row">

              <span>
                Transactions
              </span>

              <strong>
                {transactions.length}
              </strong>

            </div>


            <div className="copilot-data-row">

              <span>
                Income
              </span>

              <strong>
                ₹{Number(
                  summary.total_income || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="copilot-data-row">

              <span>
                Spending
              </span>

              <strong>
                ₹{Number(
                  summary.total_expenses || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="copilot-data-row">

              <span>
                Savings
              </span>

              <strong>
                ₹{Number(
                  summary.savings || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="copilot-data-divider" />


            <div className="copilot-data-footer">

              <span>
                Savings rate
              </span>

              <strong>
                {Number(
                  summary.savings_rate || 0
                ).toFixed(1)}
                %
              </strong>

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}


export default Copilot;