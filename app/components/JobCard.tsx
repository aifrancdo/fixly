"use client"

import { Phone, Check } from "lucide-react"
import { formatTime } from "../utils/formatTime"

export default function JobCard({ job, onClick, onDone, search }: any) {

  function highlight(text: string, search: string) {
    if (!search) return text

    const parts = text.split(new RegExp(`(${search})`, "gi"))

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} style={{ fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  const getColor = (status: string) => {
    if (status === "URGENT") return "#ef4444"
    if (status === "PENDENTS") return "#eab308"
    if (status === "CONTACTAT") return "#f97316"
    if (status === "PROGRAMAT" || status === "PROGRAMADES") return "#3b82f6"
    if (status === "FETES") return "#22c55e"
    return "#999"
  }

  function daysSince(dateString: string) {
    if (!dateString) return 0
    const start = new Date(dateString)
    const today = new Date()
    const diff = today.getTime() - start.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  function getDaysColor(days: number) {
    if (days > 5) return "#ef4444"
    if (days >= 2) return "#eab308"
    return "#999"
  }

  const canMarkDone =
    job.status === "PROGRAMAT" ||
    job.status === "PROGRAMADES" ||
    job.status === "URGENT"

  const visit = job.visits?.[0]
  const days = job.createdAt ? daysSince(job.createdAt) : 0

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        marginBottom: "12px",
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.15s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)"
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)"
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(1px)"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)"
      }}
    >

      {/* COLOR */}
      <div style={{
        width: "6px",
        background: getColor(job.status)
      }} />

      {/* CONTINGUT */}
      <div style={{
        flex: 1,
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        {/* ESQUERRA */}
        <div>

          {/* TITOL */}
          <div style={{
            fontWeight: "bold",
            fontSize: "15px",
            marginBottom: "2px"
          }}>
            {highlight(job.title, search)}
          </div>

          {/* CLIENT */}
          <div style={{
            color: "#444",
            fontSize: "13px",
            marginBottom: "4px"
          }}>
            {highlight(job.client, search)}
          </div>

          {/* DATA */}
          {visit && (
            <div style={{
              fontSize: "13px",
              fontWeight: "600"
            }}>
              {formatTime(visit.time)}
            </div>
          )}

          {/* INFO */}
          <div style={{
  fontSize: "11px",
  color: "#999",
  marginTop: "4px",
  display: "flex",
  gap: "10px"
}}>
  <span>{job.empresa}</span>

<span style={{ marginLeft: "6px" }}>
  {job.incidentNumber ? `#${job.incidentNumber}` : "-"}
</span>

</div>

        </div>

        {/* DRETA */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>

          {/* TEL */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `tel:${job.phone || ""}`
            }}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer"
            }}
          >
            <Phone size={16} />
          </button>

          {/* DONE */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (canMarkDone) {
                onDone && onDone(job)
              }
            }}
            style={{
              border: "none",
              background: canMarkDone ? "#dcfce7" : "#eee",
              borderRadius: "8px",
              padding: "8px",
              cursor: canMarkDone ? "pointer" : "not-allowed",
              opacity: canMarkDone ? 1 : 0.4
            }}
          >
            <Check
              size={16}
              color={canMarkDone ? "#16a34a" : "#999"}
            />
          </button>

        </div>

      </div>
    </div>
  )
}