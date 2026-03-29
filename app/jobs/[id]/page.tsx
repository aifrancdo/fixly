"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Phone, Check, Calendar, Trash, X } from "lucide-react"
import { formatTime } from "../../utils/formatTime"

export default function JobDetailPage() {

  const router = useRouter()
  const params = useParams()

  const [job, setJob] = useState<any>(null)
  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    const found = stored.find((j: any) => String(j.id) === params.id)
    setJob(found)
  }, [params.id])

  if (!job) return <div style={{ padding: "20px" }}>Carregant...</div>

  const getColor = (status: string) => {
    if (status === "URGENT") return "#ef4444"
    if (status === "PENDENTS") return "#eab308"
    if (status === "CONTACTAT") return "#f97316"
    if (status === "PROGRAMAT" || status === "PROGRAMADES") return "#3b82f6"
    if (status === "FETES") return "#22c55e"
    return "#999"
  }

  function formatDateFull(dateString: string) {
  const d = new Date(dateString)

  const day = d.getDate()
  const month = d.toLocaleDateString("ca-ES", { month: "long" })
  const year = d.getFullYear()

  const monthFormatted =
    month.charAt(0).toUpperCase() + month.slice(1)

  return `${day} ${monthFormatted} ${year}`
}

  const canMarkDone =
    job.status === "PROGRAMAT" ||
    job.status === "PROGRAMADES" ||
    job.status === "URGENT"

  const markAsDone = () => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")

    const updated = stored.map((j: any) =>
      j.id === job.id ? { ...j, status: "FETES" } : j
    )

    localStorage.setItem("jobs", JSON.stringify(updated))
    router.push("/dashboard")
  }

  const deleteJob = () => {
    const confirmDelete = confirm("Eliminar aquesta feina?")
    if (!confirmDelete) return

    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    const filtered = stored.filter((j: any) => j.id !== job.id)
    localStorage.setItem("jobs", JSON.stringify(filtered))
    router.push("/dashboard")
  }

  const addVisit = () => {
    if (!visitDate) return

    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")

    const updated = stored.map((j: any) => {
      if (j.id === job.id) {
        const visits = j.visits || []

        return {
          ...j,
          status: "PROGRAMAT",
          visits: [...visits, { date: visitDate, time: visitTime }]
        }
      }
      return j
    })

    localStorage.setItem("jobs", JSON.stringify(updated))

    setVisitDate("")
    setVisitTime("")

    const updatedJob = updated.find((j: any) => j.id === job.id)
    setJob(updatedJob)
  }

  const removeVisit = (index: number) => {

    const confirmDelete = confirm("Eliminar aquesta visita?")
    if (!confirmDelete) return

    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")

    const updated = stored.map((j: any) => {
      if (j.id === job.id) {
        const visits = [...(j.visits || [])]
        visits.splice(index, 1)
        return { ...j, visits }
      }
      return j
    })

    localStorage.setItem("jobs", JSON.stringify(updated))

    const updatedJob = updated.find((j: any) => j.id === job.id)
    setJob(updatedJob)
  }

  const cancelVisit = (index: number) => {

    const confirmCancel = confirm("Segur que vols cancel·lar aquesta visita?")
    if (!confirmCancel) return

    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")

    const updated = stored.map((j: any) => {
      if (j.id === job.id) {
        const visits = [...(j.visits || [])]

        visits[index] = {
          ...visits[index],
          status: "CANCELADA"
        }

        return { ...j, visits }
      }
      return j
    })

    localStorage.setItem("jobs", JSON.stringify(updated))

    const updatedJob = updated.find((j: any) => j.id === job.id)
    setJob(updatedJob)
  }

  const visit = job.visits?.[0]

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>

      {/* BACK */}
      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
}}>

  <button
  onClick={() => router.back()}
  style={{
    width: "36px",
    height: "36px",
    background: "#fff",
    border: "1px solid #000",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px"
  }}
>
  ←
</button>

  <button
    onClick={deleteJob}
    style={{
      background: "#fee2e2",
      border: "1px solid #ef4444",
      borderRadius: "8px",
      padding: "8px",
      cursor: "pointer"
    }}
  >
    <Trash size={16} color="#ef4444" />
  </button>

</div>

      {/* HEADER */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "4px"
        }}>
          {job.title}
        </div>

        <div style={{
          fontSize: "14px",
          color: "#444"
        }}>
          {job.client}
        </div>

        <div style={{
          fontSize: "12px",
          color: "#999"
        }}>
          {job.empresa}
        </div>
      </div>

      {/* ACCIONS PRINCIPALS */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>

        <button
          onClick={() => window.location.href = `tel:${job.phone}`}
          style={{
            flex: 1,
            padding: "12px",
            background: "#f3f4f6",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          <Phone size={18} />
        </button>

        <button
          onClick={markAsDone}
          disabled={!canMarkDone}
          style={{
            flex: 1,
            padding: "12px",
            background: canMarkDone ? "#22c55e" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: canMarkDone ? "pointer" : "not-allowed",
            fontWeight: "bold"
          }}
        >
          ✔ Feta
        </button>

      </div>

      {/* VISITES */}
<div style={{
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px"
}}>

  <div style={{
    fontWeight: "bold",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }}>
    <Calendar size={16} />
    Visites
  </div>

  {job.visits?.length > 0 ? (
    job.visits.map((v: any, i: number) => {

      const isCancelled = v.status === "CANCELADA"

      return (
        <div key={i} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid #f0f0f0",
          opacity: isCancelled ? 0.5 : 1
        }}>

          {/* TEXT */}
          <div>
            <div style={{
              fontWeight: "600",
              fontSize: "14px"
            }}>
              {formatDateFull(v.date)} · {formatTime(v.time)}
            </div>
          </div>

          {/* ACCIONS */}
          <div style={{ display: "flex", gap: "6px" }}>

            {/* ➡️ Moure */}
            {!isCancelled && (
              <button
                onClick={() => {
                  setVisitDate(v.date)
                  setVisitTime(v.time)
                }}
                style={{
                  background: "#e0f2fe",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px",
                  cursor: "pointer"
                }}
              >
                →
              </button>
            )}

            {/* ❌ Cancel·lar */}
            {!isCancelled && (
              <button
                onClick={() => cancelVisit(i)}
                style={{
                  background: "#fee2e2",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px",
                  cursor: "pointer"
                }}
              >
                <X size={14} />
              </button>
            )}

            {/* 🗑 Eliminar */}
            <button
              onClick={() => removeVisit(i)}
              style={{
                background: "#eee",
                border: "none",
                borderRadius: "6px",
                padding: "6px",
                cursor: "pointer"
              }}
            >
              <Trash size={14} />
            </button>

          </div>

        </div>
      )
    })
  ) : (
    <div style={{ color: "#666" }}>No hi ha visites</div>
  )}

  {/* INPUTS */}
  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

    <input
      type="date"
      value={visitDate}
      onChange={(e) => setVisitDate(e.target.value)}
      style={{
        flex: 1,
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    />

    <input
      type="time"
      value={visitTime}
      onChange={(e) => setVisitTime(e.target.value)}
      style={{
        flex: 1,
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    />

  </div>

  {/* ➕ AFEGIR (A SOTA) */}
  <button
    onClick={addVisit}
    style={{
      marginTop: "10px",
      width: "100%",
      padding: "10px",
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Afegir visita
  </button>

</div>

      {/* ACCIONS FINALS */}
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "20px"
}}>

  {/* BOTONS */}
  <div style={{ display: "flex", gap: "10px" }}>

    <button
      onClick={() => router.back()}
      style={{
        padding: "10px 14px",
        background: "#eee",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      Cancel·lar
    </button>

    <button
      onClick={() => router.back()}
      style={{
        padding: "10px 14px",
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Guardar
    </button>

  </div>

</div>
    </main>
  )
}