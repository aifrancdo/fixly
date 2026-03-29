"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Clock, Phone, Calendar } from "lucide-react"
import StatCard from "../components/StatCard"
import { Inbox } from "lucide-react"
import { Building2, ChevronDown } from "lucide-react"

export default function DashboardPage() {

  const router = useRouter()

  const [jobs, setJobs] = useState<any[]>([])
  const [empresaFilter, setEmpresaFilter] = useState("TOTES")
  const [dateFilter, setDateFilter] = useState("TODAY")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    setJobs(stored)
  }, [])

  useEffect(() => {
    const savedEmpresa = localStorage.getItem("empresaFilter")
    if (savedEmpresa) setEmpresaFilter(savedEmpresa)
  }, [])

  useEffect(() => {
    localStorage.setItem("empresaFilter", empresaFilter)
  }, [empresaFilter])

  const updateJob = (updatedJob: any) => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    const updated = stored.map((j: any) =>
      Number(j.id) === Number(updatedJob.id) ? updatedJob : j
    )
    localStorage.setItem("jobs", JSON.stringify(updated))
    setJobs(updated)
  }

  const markAsDone = (job: any) => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")

    const updated = stored.map((j: any) =>
      Number(j.id) === Number(job.id)
        ? { ...j, status: "FETES" }
        : j
    )

    localStorage.setItem("jobs", JSON.stringify(updated))
    setJobs(updated)
  }

  const markAsContacted = (job: any) => {
    updateJob({ ...job, status: "NOVES" })
  }

  const filteredJobs =
    empresaFilter === "TOTES"
      ? jobs
      : jobs.filter(job => job.empresa === empresaFilter)

  const countByStatus = (status: string) => {
    return filteredJobs.filter(job => job.status === status).length
  }

  const stats = [
    { title: "URGENT", color: "red", status: "URGENT" },
    { title: "NOVES", color: "orange", status: "NOVES" },
    { title: "PROGRAMADES", color: "blue", status: "PROGRAMADES" },
    { title: "PENDENTS", color: "yellow", status: "PENDENTS" },
    { title: "FETES", color: "green", status: "FETES" }
  ]
  
  // 🔥 CALCULAR NOVES
  const novesCount = jobs.filter((j: any) => j.status === "NOVES").length

  function getVisitDateTime(visit: any) {
    if (!visit?.date) return null
    return new Date(`${visit.date}T${visit.time || "00:00"}`)
  }

  function isToday(dt: Date) {
    return dt.toDateString() === new Date().toDateString()
  }

  function isTomorrow(dt: Date) {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    return dt.toDateString() === t.toDateString()
  }

  function isThisWeek(dt: Date) {
    const start = new Date()
    start.setDate(start.getDate() + 1)
    const end = new Date()
    end.setDate(start.getDate() + 7)
    return dt >= start && dt <= end
  }

  function isThisMonth(dt: Date) {
    const now = new Date()
    return dt.getMonth() === now.getMonth() &&
           dt.getFullYear() === now.getFullYear()
  }

  function isNextMonth(dt: Date) {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0)
    return dt >= start && dt <= end
  }

  function formatDate(dateString: string) {
    if (!dateString) return ""
    const d = new Date(dateString)
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
  }

  const agendaJobs = filteredJobs
    .filter(job => {
      if (job.status === "FETES") return false

      const visit = job.visits?.[0]
      if (!visit) return false

      const dt = getVisitDateTime(visit)
      if (!dt) return false

      if (dateFilter === "ALL") return true
      if (dateFilter === "TODAY") return isToday(dt)
      if (dateFilter === "TOMORROW") return isTomorrow(dt)
      if (dateFilter === "WEEK") return isThisWeek(dt)
      if (dateFilter === "THIS_MONTH") return isThisMonth(dt)
      if (dateFilter === "NEXT_MONTH") return isNextMonth(dt)

      return true
    })
    .sort((a, b) => {
      const aDate = getVisitDateTime(a.visits?.[0])
      const bDate = getVisitDateTime(b.visits?.[0])
      return (aDate?.getTime() || 0) - (bDate?.getTime() || 0)
    })

  const scheduledJobs = filteredJobs.filter(job => job.visits?.[0])

  const todayCount = scheduledJobs.filter(j => {
    const dt = getVisitDateTime(j.visits?.[0])
    return dt && isToday(dt)
  }).length

  const tomorrowCount = scheduledJobs.filter(j => {
    const dt = getVisitDateTime(j.visits?.[0])
    return dt && isTomorrow(dt)
  }).length

  const monthCount = scheduledJobs.filter(j => {
    const dt = getVisitDateTime(j.visits?.[0])
    return dt && isThisMonth(dt)
  }).length

const todayAgendaCount = jobs.filter(job => {
  if (job.status === "FETES") return false

  const visit = job.visits?.[0]
  if (!visit) return false

  const dt = getVisitDateTime(visit)
  return dt && isToday(dt)
}).length

const tomorrowAgendaCount = jobs.filter(job => {
  if (job.status === "FETES") return false

  const visit = job.visits?.[0]
  if (!visit) return false

  const dt = getVisitDateTime(visit)
  return dt && isTomorrow(dt)
}).length

  return (
    <main style={{ padding: "20px", minHeight: "100vh" }}>

      <h1 style={{
  textAlign: "center",
  fontSize: "36px",
  marginBottom: "20px"
}}>
  Serveis
</h1>

      <div style={{
  position: "relative",
  marginBottom: "15px"
}}>

  {/* ICONA ESQUERRA */}
  <div style={{
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#666"
  }}>
    <Building2 size={16} />
  </div>

  {/* SELECT REAL */}
  <select
    value={empresaFilter}
    onChange={(e) => setEmpresaFilter(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 35px 12px 35px",
      background: "#fff",
      border: "2px solid #000",
      borderRadius: "10px",
      fontSize: "14px",
      cursor: "pointer",
      appearance: "none"
    }}
  >
    <option value="TOTES">TOTES LES EMPRESES</option>
    <option value="TRES">TRES</option>
    <option value="ALTRES">ALTRES</option>
  </select>

  {/* CARET DRETA */}
  <div style={{
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#666"
  }}>
    <ChevronDown size={16} />
  </div>

</div>

      <button
  onClick={() => router.push("/jobs/new")}

  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}

  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "25px",
    background: "#111",
    color: "#fff",
    border: "2px solid #000",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    cursor: "pointer"
  }}
>
  + Nova feina
</button>

     {/* ===== RESUM PRO ===== */}

{/* TOP 3 */}
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "15px",
  marginBottom: "20px",
  alignItems: "stretch"
}}>

  {/* NOVES */}
  <StatCard
    title="NOVES"
    count={novesCount}
    color="#f97316"
    icon={<Inbox size={18} color="#f97316" />}
    onClick={() => router.push("/jobs?status=NOVES")}
  />

  {/* PENDENTS */}
  <StatCard
    title="PENDENTS"
    count={countByStatus("PENDENTS")}
    color="#eab308"
    icon={<Clock size={18} color="#eab308" />}
    onClick={() => router.push(`/jobs?status=PENDENTS&empresa=${empresaFilter}`)}
  />

  {/* PROGRAMAT */}
  <StatCard
    title="PROGRAMAT"
    count={countByStatus("PROGRAMAT") + countByStatus("PROGRAMADES")}
    color="#3b82f6"
    icon={<Calendar size={18} color="#3b82f6" />}
    onClick={() => router.push(`/jobs?status=PROGRAMAT&empresa=${empresaFilter}`)}
  />

</div>

{/* 🚨 URGENTS */}
<div
  onClick={() =>
    router.push(`/jobs?status=URGENT&empresa=${empresaFilter}`)
  }
  style={{
    padding: "14px 18px",
    borderRadius: "10px",
    border: "2px solid #ef4444",
    background: "#fff5f5",
    marginBottom: "20px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer"
  }}
>

  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }}>
    <div style={{
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "#ef4444"
    }} />
    URGENT
  </div>

  <div style={{
    fontSize: "18px",
    fontWeight: "bold"
  }}>
    {countByStatus("URGENT")}
  </div>

</div>

{/* ✅ FETES */}
<div
  className="win-panel"
  onClick={() => router.push(`/jobs?status=FETES&empresa=${empresaFilter}`)}
  style={{
  padding: "12px",
  textAlign: "center",
  fontSize: "13px",
  cursor: "pointer",

  background: "#f0fdf4",        // verd molt suau
  border: "2px solid #22c55e",  // verd viu
  borderRadius: "10px",

  fontWeight: "500"
}}
>
  ✔ FETES: {countByStatus("FETES")}
</div>

{/* ===== AGENDA ===== */}

<h2 style={{
  fontSize: "22px",
  fontWeight: "600",
  marginTop: "30px",
  marginBottom: "15px"
}}>
  Agenda
</h2>

{/* BOTONS AVUI / DEMÀ */}
<div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "25px"
}}>
  {[
    { label: `AVUI (${todayAgendaCount})`, value: "TODAY" },
    { label: `DEMÀ (${tomorrowAgendaCount})`, value: "TOMORROW" }
  ].map(btn => (
    <button
      key={btn.value}
      onClick={() => setDateFilter(btn.value)}
      style={{
        padding: "10px 18px",
        fontSize: "14px",
        background: dateFilter === btn.value ? "#111" : "#fff",
        color: dateFilter === btn.value ? "#fff" : "#000",
        border: "1px solid #ddd",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      {btn.label}
    </button>
  ))}
</div>

{/* LLISTA */}
{agendaJobs.map(job => {

  const visit = job.visits?.[0]

  return (
    <div
      key={job.id}
      className="win-panel"
      onClick={() => router.push(`/jobs/${job.id}`)}
      style={{ display: "flex", marginBottom: "10px", cursor: "pointer" }}
    >

      <div style={{ width: "6px", background: "blue" }} />

      <div style={{
        flex: 1,
        padding: "20px",
        display: "flex",
        justifyContent: "space-between"
      }}>

        <div>
          <div style={{ fontWeight: "bold" }}>{job.title}</div>
          <div>{job.client}</div>

          {visit && (
            <div style={{ marginTop: "5px", fontWeight: "bold" }}>
              📅 {formatDate(visit.date)} {visit.time}
            </div>
          )}
        </div>

        <button
          className="win-button"
          onClick={(e) => {
            e.stopPropagation()
            markAsDone(job)
          }}
        >
          ✔
        </button>

      </div>
    </div>
  )
})}

{agendaJobs.length === 0 && (
  <div style={{
    padding: "20px",
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: "8px",
    textAlign: "center",
    color: "#666"
  }}>
    No hi ha feines per aquest dia
  </div>
)}

    </main>
  )
}