import React, { useState } from "react";

const PasswordGate = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (!process.env.REACT_APP_UPLOAD_PASSWORD) {
    return children;
  }

  if (authenticated) {
    return children;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === process.env.REACT_APP_UPLOAD_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "105px 20px 0",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#f5f5f5",
        padding: 40,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}>
        <h2>Upload Access</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          autoFocus
          style={{
            padding: "10px 16px",
            fontSize: 16,
            border: error ? "2px solid red" : "1px solid #ccc",
            borderRadius: 4,
            width: 200,
            marginBottom: 12,
            display: "block",
          }}
        />
        <button type="submit" style={{
          padding: "10px 24px",
          fontSize: 16,
          background: "#0073e6",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}>
          Submit
        </button>
        {error && <p style={{ color: "red", marginTop: 10 }}>Incorrect password</p>}
      </form>
    </div>
  );
};

export default PasswordGate;