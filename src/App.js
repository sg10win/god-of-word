import React, { useEffect, useState } from "react";

function App() {
  const [hintLines, setHintLines] = useState([]);
  const [typedHints, setTypedHints] = useState([]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/clue-of-the-day")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clue");
        return res.json();
      })
      .then((data) => {
        const hints = [
          data.hint1,
          data.hint2,
          data.hint3
        ].filter(Boolean);
        setHintLines(hints);
        setCorrectAnswers((data.answers || []).map((ans) => ans.toLowerCase()));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("⚠️ Failed to load today's clue.");
        setLoading(false);
      });
  }, []);

  // Typewriter effect across multiple lines
  useEffect(() => {
    if (!hintLines.length) return;
  
    // Initialize typedHints with empty strings for each line
    setTypedHints(Array(hintLines.length).fill(""));
  
    let currentHintIndex = 0;
    let charIndex = 0;
    let currentHint = hintLines[0];
    let interval;
  
    const typeNextChar = () => {
      if (currentHintIndex >= hintLines.length) {
        clearInterval(interval);
        return;
      }
  
      if (charIndex < currentHint.length-1) {
        setTypedHints((prev) => {
          const updated = [...prev];
          updated[currentHintIndex] += currentHint[charIndex];
          return updated;
          
        });
        charIndex++;
      } else {
        currentHintIndex++;
        charIndex = 0;
        currentHint = hintLines[currentHintIndex];
      }
    };
  
    interval = setInterval(typeNextChar, 40);
  
    return () => clearInterval(interval);
  }, [hintLines]);

  const handleGuess = () => {
    const normalized = input.trim().toLowerCase();
    if (correctAnswers.includes(normalized)) {
      setFeedback("🎉 Correct! You nailed it!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      setFeedback("❌ Try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">🧠 Broken Clues</h1>

      {loading && <p className="hint">Loading clue...</p>}
      {error && <p className="hint">{error}</p>}

      {!loading && !error && (
        <>
          <div className="hint-box">
            {typedHints.map((hint, idx) => (
              <div key={idx}>Hint {idx + 1}: {hint}</div>
            ))}
          </div>

          <div className="input-section">
            <input
              className="guess-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your guess..."
            />
            <button onClick={handleGuess}>Check</button>
          </div>

          <div className="feedback">{feedback}</div>

          {showConfetti && <div className="confetti">🎊🎈✨💥</div>}
        </>
      )}

      {/* 🔧 Style Block */}
      <style>{`
        .container {
          max-width: 600px;
          margin: 40px auto;
          font-family: monospace;
          text-align: center;
          padding: 0 20px;
        }

        .title {
          font-size: 2rem;
          margin-bottom: 30px;
        }

        .hint-box {
          border: 2px solid #ccc;
          background-color: #f9f9f9;
          color: #222;
          border-radius: 8px;
          padding: 16px;
          font-size: 15px;
          text-align: left;
          white-space: pre-wrap;
          line-height: 1.4;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          min-height: 100px;
        }

        .input-section {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 10px;
          width: 100%;
        }

        .guess-input {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        button {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }

        .feedback {
          font-size: 18px;
          font-weight: 600;
          margin-top: 5px;
        }

        .confetti {
          font-size: 30px;
          animation: pop 0.5s ease-in-out;
          margin-top: 10px;
        }

        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;
