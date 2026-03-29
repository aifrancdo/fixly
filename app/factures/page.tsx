"use client"

import { useEffect, useState } from "react"

export default function FacturesPage() {

  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    setJobs(stored)
  }, [])

  // 🔥 només feines fetes
  const doneJobs = jobs.filter(j => j.status === "FETES")

  return (
    <main style={{
      padding: "20px",
      maxWidth: "700px",
      margin: "0 auto"
    }}>

      <h1 style={{
        fontSize: "28px",
        marginBottom: "20px"
      }}>
        Factures
      </h1>

      {doneJobs.length === 0 && (
        <div style={{ color: "#666" }}>
          No hi ha feines per facturar
        </div>
      )}

      {doneJobs.map((job: any) => (
        <div
          key={job.id}
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "10px"
          }}
        >

          <div style={{ fontWeight: "bold" }}>
            {job.title}
          </div>

          <div style={{ fontSize: "13px", color: "#666" }}>
            {job.client}
          </div>

          <div style={{ fontSize: "12px", marginTop: "6px" }}>
            {job.empresa}
          </div>

          {/* FUTUR */}
          <div style={{
            marginTop: "10px",
            fontSize: "12px",
            color: "#999"
          }}>
            (Factura pendent)
          </div>

        </div>
      ))}

    </main>
  )
}