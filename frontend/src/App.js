import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function App() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).slice(2));
  const [response, setResponse] = useState("");
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    axios.get(`${API}/daily-wisdom?lang=${lang}`).then(res => setDaily(res.data));
  }, [lang]);

  const handleAsk = async () => {
    const res = await axios.post(`${API}/ask`, { query, lang, session_id: sessionId });
    setResponse(res.data.answer);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Krishna AI</h1>
      <label>
        Language:
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </label>
      <div style={{ margin: "1rem 0" }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask Krishna..."
          style={{ width: "80%" }}
        />
        <button onClick={handleAsk}>Ask</button>
      </div>
      <div>
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
      <div style={{ marginTop: "2rem", background: "#f6f6f6", padding: "1rem" }}>
        <h3>Daily Gita Wisdom</h3>
        {daily && (
          <div>
            <div><b>{daily.verse}</b></div>
            <div>{daily.reference}</div>
            <div>{daily.context}</div>
            <div><i>{daily.commentary}</i></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;