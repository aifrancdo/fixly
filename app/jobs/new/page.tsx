"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewJobPage() {

  const router = useRouter()

  const [title, setTitle] = useState("")
  const [client, setClient] = useState("")
  const [empresa, setEmpresa] = useState("TRES")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const [status, setStatus] = useState("PENDENTS")
  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")
  const [incidentNumber, setIncidentNumber] = useState("")

  const handleSave = () => {

    setError("")

    if (!title.trim()) {
      return setError("El títol és obligatori")
    }

    if (!client.trim()) {
      return setError("El client és obligatori")
    }

    if (!phone.trim() && !email.trim()) {
      return setError("Telèfon o email obligatori")
    }

    const newJob = {
  id: Date.now(),
  title,
  client,
  empresa,
  address,
  phone,
  email,
  description,
  status: "PENDENTS",
  createdAt: new Date().toISOString(),

  visits: status === "PROGRAMAT" && visitDate
    ? [{
        date: visitDate,
        time: visitTime
      }]
    : []
}

    const existing = JSON.parse(localStorage.getItem("jobs") || "[]")
    existing.push(newJob)
    localStorage.setItem("jobs", JSON.stringify(existing))

    router.push("/dashboard")
  }

  return (
    <main style={{
      background: "#f0f0f0",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      paddingTop: "40px"
    }}>

      <div style={{ width: "500px" }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px"
        }}>
          <button
            onClick={() => router.back()}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            ←
          </button>

          <h1 style={{
            fontSize: "26px",
            fontWeight: "bold"
          }}>
            Crear nova feina
          </h1>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            fontSize: "13px"
          }}>
            {error}
          </div>
        )}

        {/* CARD */}
        <div style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
        }}>

          {/* EMPRESA */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              EMPRESA
            </div>
            <select
              className="win-input"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <option value="TRES">TRES</option>
              <option value="ALTRES">ALTRES</option>
            </select>
          </div>

          {/* INCIDENT */}
<div style={{ marginBottom: "15px" }}>
  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
    Nº INCIDÈNCIA
  </div>
  <input
    className="win-input"
    value={incidentNumber}
    onChange={(e) => setIncidentNumber(e.target.value)}
  />
</div>

          {/* TITOL */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              TÍTOL *
            </div>
            <input
              className="win-input"
              placeholder="Ex: Fuga broc cuina"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* CLIENT */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              CLIENT *
            </div>
            <input
              className="win-input"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          {/* PHONE */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              TELÈFON
            </div>
            <input
              className="win-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              EMAIL
            </div>
            <input
              className="win-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ADDRESS */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              ADREÇA
            </div>
            <input
              className="win-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              DESCRIPCIÓ
            </div>
            <textarea
              className="win-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ESTAT */}
<div style={{ marginBottom: "20px" }}>

  <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
    ESTAT
  </div>

  <div style={{ display: "flex", gap: "8px" }}>

    {/* URGENT */}
    <button
      onClick={() => setStatus("URGENT")}
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: "6px",
        transition: "all 0.15s ease",
        border: status === "URGENT" ? "1px solid #ef4444" : "1px solid #eee",
        background: status === "URGENT" ? "#fee2e2" : "#fff",
        color: "#ef4444",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      URGENT
    </button>

    {/* PENDENT */}
    <button
      onClick={() => setStatus("PENDENTS")}
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: "6px",
        transition: "all 0.15s ease",
        border: status === "PENDENTS" ? "1px solid #eab308" : "1px solid #eee",
        background: status === "PENDENTS" ? "#fef3c7" : "#fff",
        color: "#eab308",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      PENDENT
    </button>

    {/* PROGRAMAT */}
    <button
      onClick={() => setStatus("PROGRAMAT")}
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: "6px",
        transition: "all 0.15s ease",
        border: status === "PROGRAMAT" ? "1px solid #3b82f6" : "1px solid #eee",
        background: status === "PROGRAMAT" ? "#dbeafe" : "#fff",
        color: "#3b82f6",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      PROGRAMAT
    </button>

  </div>
</div>

{status === "PROGRAMAT" && (
  <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

    <input
      type="date"
      className="win-input"
      value={visitDate}
      onChange={(e) => setVisitDate(e.target.value)}
      style={{ flex: 1 }}
    />

    <input
      type="time"
      className="win-input"
      value={visitTime}
      onChange={(e) => setVisitTime(e.target.value)}
      style={{ flex: 1 }}
    />

  </div>
)}

          {/* BUTTON */}
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "12px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Guardar feina
          </button>

        </div>
      </div>
    </main>
  )
}