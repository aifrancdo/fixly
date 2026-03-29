"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import JobCard from "../components/JobCard"
import { Building2, ChevronDown } from "lucide-react"

export default function JobsPage() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const status = searchParams.get("status")
  const empresaFromUrl = searchParams.get("empresa")

  const [jobs, setJobs] = useState<any[]>([])
  const [empresaFilter, setEmpresaFilter] = useState("TOTES")
  const [search, setSearch] = useState("")

  // 🔥 carregar feines
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    setJobs(stored)
  }, [])

  // 🔥 empresa (URL > localStorage)
  useEffect(() => {
    if (empresaFromUrl) {
      setEmpresaFilter(empresaFromUrl)
    } else {
      const saved = localStorage.getItem("empresaFilter")
      if (saved) setEmpresaFilter(saved)
    }
  }, [empresaFromUrl])

  useEffect(() => {
    localStorage.setItem("empresaFilter", empresaFilter)
  }, [empresaFilter])

  // =========================
  // 📅 FUNCIONS
  // =========================

  function hasVisitToday(job: any) {
    const today = new Date().toISOString().split("T")[0]
    return job.visits?.some((v: any) => v.date === today)
  }

  function hasVisitTomorrow(job: any) {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const tomorrow = d.toISOString().split("T")[0]
    return job.visits?.some((v: any) => v.date === tomorrow)
  }

  function hasVisitThisWeek(job: any) {
    const now = new Date()
    const end = new Date()
    end.setDate(now.getDate() + 7)

    return job.visits?.some((v: any) => {
      const visitDate = new Date(v.date)
      return visitDate >= now && visitDate <= end
    })
  }

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

function getScore(job: any, search: string) {
  const s = (search || "").toLowerCase()

  if (!s) return 0

  let score = 0

  if ((job.title || "").toLowerCase().includes(s)) score += 3
  if ((job.client || "").toLowerCase().includes(s)) score += 2
  if ((job.empresa || "").toLowerCase().includes(s)) score += 1

  return score
}

  // =========================
  // 🔥 FILTRE
  // =========================

  const filteredJobs = jobs
  .filter((job: any) => {

    const s = (search || "").toLowerCase()

    const matchStatus = status
  ? job.status === status
  : job.status !== "NOVES"

    const matchEmpresa =
      empresaFilter === "TOTES"
        ? true
        : job.empresa === empresaFilter

    const matchSearch =
      (job.title || "").toLowerCase().includes(s) ||
      (job.client || "").toLowerCase().includes(s) ||
      (job.empresa || "").toLowerCase().includes(s)

    return matchStatus && matchEmpresa && matchSearch
  })
  .sort((a: any, b: any) => {
    return getScore(b, search || "") - getScore(a, search || "")
  })

  return (
    <main style={{
      padding: "20px",
      maxWidth: "700px",
      margin: "0 auto"
    }}>

      {/* 🔥 TÍTOL */}
      <h1 style={{
        fontSize: "28px",
        marginBottom: "15px"
      }}>
        Feines
      </h1>

      {/* 🔍 CERCA */}
      <div style={{ position: "relative", marginBottom: "15px" }}>

  <input
    placeholder="Buscar client o feina..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      paddingRight: "35px", // 🔥 important per fer espai a la X
      border: "2px solid #000",
      borderRadius: "12px"
    }}
  />

  {/* ❌ BOTÓ NETEJAR */}
  {search && (
    <div
      onClick={() => setSearch("")}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "14px",
        color: "#666"
      }}
    >
      ✕
    </div>
  )}

</div>

      {/* 🎯 FILTRES RÀPIDS */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "15px"
      }}>
        {[
          { label: "TOTES", value: null },
          { label: "URGENT", value: "URGENT" },
          { label: "PENDENTS", value: "PENDENTS" },
          { label: "PROGRAMAT", value: "PROGRAMAT" }
        ].map(btn => {

          const active = status === btn.value || (!btn.value && !status)

          return (
            <button
              key={btn.label}
              onClick={() => {
                if (!btn.value) {
                  router.push("/jobs")
                } else {
                  router.push(`/jobs?status=${btn.value}`)
                }
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#000",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {btn.label}
            </button>
          )
        })}
      </div>

      {/* 🏢 EMPRESA */}
      <div style={{ marginBottom: "10px", position: "relative" }}>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "2px solid #000",
          borderRadius: "10px",
          padding: "12px",
          background: "#fff"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Building2 size={16} />
            {empresaFilter === "TOTES" ? "TOTES LES EMPRESES" : empresaFilter}
          </div>

          <ChevronDown size={16} />
        </div>

        <select
          value={empresaFilter}
          onChange={(e) => setEmpresaFilter(e.target.value)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer"
          }}
        >
          <option value="TOTES">TOTES LES EMPRESES</option>
          <option value="TRES">TRES</option>
          <option value="ALTRES">ALTRES</option>
        </select>

      </div>

      {/* 📦 LLISTA */}
      {filteredJobs.length === 0 && (
        <div style={{ color: "#666" }}>
          No hi ha feines
        </div>
      )}

      {filteredJobs.map((job) => (
        <JobCard
  key={job.id}
  job={job}
  search={search}
  onClick={() => router.push(`/jobs/${job.id}`)}
/>
      ))}

    </main>
  )
}