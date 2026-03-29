"use client"

import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  return (
    <main
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#b1b1b1",
    fontFamily: '"JetBrains Mono", monospace'
  }}
>

<h2
  style={{
    marginBottom: "25px",
    color: "#000",
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "1px"
  }}
>
  Login
</h2>

<div
  style={{
    background: "#c0c0c0",
    padding: "30px",
    width: "350px",
    borderTop: "2px solid white",
    borderLeft: "2px solid white",
    borderRight: "2px solid #808080",
    borderBottom: "2px solid #808080"
  }}
>

        <label style={{ color: "#000" }}>Email:</label>

        <input
          type="email"
          placeholder="email@example.com"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            marginBottom: "15px",
            border: "2px inset #fff",
            background: "#ffffff"
          }}
        />

        <label style={{ color: "#000" }}>Password:</label>

        <input
          type="password"
          style={{
            color:"#000",
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            marginBottom: "20px",
            border: "2px inset #fff",
            background: "#ffffff"
          }}
        />

        <button
  className="win-button"
  onClick={() => router.push("/dashboard")}
  style={{
    width: "100%",
    padding: "10px",
    color: "#000",
    cursor: "pointer",
    fontSize: "16px"
  }}
>
  Login
</button>
      </div>
    </main>
  );
}