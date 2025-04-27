import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MODES = {
  fun: {
    label: "Fun Einstein",
    img: "/einstein-fun.jpg"
  },
  serious: {
    label: "Serious Science",
    img: "/einstein-serious.jpg"
  }
};

const BACKEND_URL = "http://localhost:8000/api/chat";

export default function EinsteinChat() {
  const [mode, setMode] = useState('fun');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleModeToggle = () => setMode(mode === 'fun' ? 'serious' : 'fun');
  const handleSend = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    setChat(prev => [...prev, { from: 'user', text: message }]);
    setMessage('');
    try {
      const res = await axios.post(BACKEND_URL, { message, mode });
      setChat(prev => [...prev, { from: 'einstein', text: res.data.reply }]);
    } catch {
      setChat(prev => [...prev, { from: 'einstein', text: "Oops! Something went wrong." }]);
    }
    setLoading(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleSend();
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  return (
    <div style={{ minHeight: "90vh", background: "#20232a", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32 }}>
      <div style={{ background: "#292b30", borderRadius: 32, boxShadow: "0 10px 36px #0008", padding: "40px 22px 0 22px", width: 470, maxWidth: "99vw", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", marginBottom: 14, background: "#111" }}>
          <img src={MODES[mode].img} alt={MODES[mode].label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <h2 style={{ color: "#fff" }}>{MODES[mode].label}</h2>
        <button onClick={handleModeToggle} style={{ margin: "18px 0 10px 0", padding: "8px 30px", borderRadius: 20, background: "#C0C0C0", border: "none", color: "#222", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
          Switch to {mode === 'fun' ? "Serious Science" : "Fun Einstein"}
        </button>
        <div style={{ background: "#22242b", minHeight: 260, maxHeight: 320, borderRadius: 18, padding: "18px 12px 4px 12px", width: "100%", margin: "12px 0 0 0", fontSize: 16, fontFamily: "inherit", boxShadow: "0 2px 12px #0002", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 186, marginBottom: 8, paddingRight: 5 }}>
            {chat.length === 0 && !loading && (
              <div style={{ opacity: 0.45, fontStyle: "italic", textAlign: "center", paddingTop: 48, color: "#bbb" }}>Ask Einstein anything…</div>
            )}
            {chat.map((msg, idx) => (
              <div key={idx} style={{ margin: "10px 0", textAlign: msg.from === 'user' ? "right" : "left", display: "flex", flexDirection: msg.from === 'user' ? "row-reverse" : "row" }}>
                <span style={{
                  display: "inline-block",
                  background: msg.from === 'einstein' ? "#3c3758" : "#575b68",
                  color: "#fff",
                  borderRadius: 16,
                  padding: "12px 18px",
                  maxWidth: "80%",
                  fontSize: 15,
                  marginBottom: "2px",
                  fontFamily: "monospace",
                  wordBreak: "break-word",
                  lineHeight: 1.45
                }}>{msg.text}</span>
              </div>
            ))}
            {loading && <div style={{ opacity: 0.7, margin: 8, fontStyle: "italic", color: "#b6c3e2" }}>Einstein is thinking…</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 7, width: "100%", background: "#23232b", borderRadius: 10, padding: "10px 5px", borderTop: "1.5px solid #353545" }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1.5px solid #444", fontSize: 16, background: "#181822", color: "#fff", outline: "none", boxShadow: "0 2px 10px #0002" }}
              placeholder="Ask Einstein anything…"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{ padding: "12px 22px", borderRadius: 8, border: "none", background: "#007bff", color: "#fff", fontWeight: "bold", fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 2px 10px #0003", opacity: loading ? 0.6 : 1 }}>
              Send
            </button>
          </div>
        </div>
      </div>
      <div style={{ margin: "28px 0 0 0", color: "#888", fontSize: 13, opacity: 0.8, textAlign: "center" }}>
        Built with React, FastAPI, and OpenAI • 2025
      </div>
    </div>
  );
}
