import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [value, setValue] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(Number(value));
    navigate("/");
  };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100vw",
        marginTop: "10%",
      }}
    >
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Employee ID"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}
