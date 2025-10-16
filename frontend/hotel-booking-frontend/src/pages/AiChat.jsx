// src/pages/AiChat.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const AI_BASE = import.meta.env.VITE_AI_API_URL || "http://localhost:8082";

export default function AiChat() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState("Balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // chat messages: { role: "assistant" | "user", content: string }
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I’m your AI travel planner. Enter destination, days, and style to generate an itinerary — then refine it with follow-ups. ✈️",
    },
  ]);

  const [refineText, setRefineText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Keep only the last 6 turns to control token usage
  const buildHistoryFrom = (arr) =>
    arr.slice(-6).map((m) => ({ role: m.role, content: m.content }));

  const callService = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${AI_BASE}/api/ai/itinerary`, payload);
      const aiText =
        res.data?.content || "I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateInitial = async (e) => {
    e.preventDefault();
    if (!destination || Number(days) < 1) {
      setError("Please enter a destination and valid number of days.");
      return;
    }

    const userMsg = {
      role: "user",
      content: `Generate a ${days}-day itinerary for ${destination} (style: ${style}).`,
    };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);

    await callService({
      destination,
      days: Number(days),
      style,
      history: buildHistoryFrom(nextMsgs),
    });
  };

  const onRefine = async (e) => {
    e.preventDefault();
    if (!refineText.trim()) return;

    const refineMsg = { role: "user", content: refineText.trim() };
    const nextMsgs = [...messages, refineMsg];
    setMessages(nextMsgs);
    setRefineText("");

    await callService({
      destination: destination || "Unknown destination",
      days: Number(days) || 3,
      style: style || "Balanced",
      history: buildHistoryFrom(nextMsgs),
    });
  };

  const copyLast = () => {
    const lastAi = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAi) navigator.clipboard.writeText(lastAi.content);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Cleared. Start again: enter destination, days, and style, then refine with follow-up messages.",
      },
    ]);
    setError(null);
    setRefineText("");
  };

  return (
    <div className="container py-5">
      {/* Back + Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            if (window.history.length > 1) history.back();
            else window.location.href = "/";
          }}
        >
          ← Back
        </button>
        <h1 className="h4 mb-0">AI Travel Itinerary</h1>
        <div />
      </div>

      {/* Initial parameters */}
      <form className="card p-3 p-md-4 shadow-sm mb-4" onSubmit={onGenerateInitial}>
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Goa, Manali, Jaipur"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Days</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Style</label>
            <select
              className="form-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option>Balanced</option>
              <option>Relaxation</option>
              <option>Adventure</option>
              <option>Luxury</option>
              <option>Budget</option>
              <option>Family</option>
              <option>Culture</option>
              <option>Nightlife</option>
            </select>
          </div>

          <div className="col-md-1 d-grid">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "..." : "Go"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </form>

      {/* Chat window */}
      <div className="card shadow-sm">
        <div
          className="card-body"
          style={{ minHeight: 360, maxHeight: 600, overflowY: "auto" }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`d-flex ${
                m.role === "user" ? "justify-content-end" : "justify-content-start"
              } mb-3`}
            >
              <div
                className={`p-3 rounded-3 ${
                  m.role === "user" ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {m.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: "pre-wrap" }}>{m.content}</span>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-muted small">AI is thinking…</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Footer actions + refine box */}
        <div className="card-footer">
          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              className="form-control"
              placeholder="Refine the plan (e.g., make Day 2 more relaxing, add kids activities)…"
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onRefine(e);
                }
              }}
            />
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={onRefine}
                disabled={loading || !refineText.trim()}
              >
                Send
              </button>
              <button className="btn btn-outline-secondary" onClick={copyLast}>
                Copy last reply
              </button>
              <button className="btn btn-outline-danger" onClick={clearChat}>
                Clear chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
