"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import JobCard from "../components/JobCard"
import { formatTime } from "../utils/formatTime"
import { Check } from "lucide-react"

export default function AgendaPage() {

  const router = useRouter()

  const [jobs, setJobs] = useState<any[]>([])
  const [filter, setFilter] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("agendaFilter") || "WEEK"
  }
  return "WEEK"
})
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    setJobs(stored)
  }, [])

  useEffect(() => {
  localStorage.setItem("agendaFilter", filter)
}, [filter])

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
    const now = new Date()
    const end = new Date()
    end.setDate(now.getDate() + 7)
    return dt >= now && dt <= end
  }

  function isTodayDate(day: Date) {
    return day.toDateString() === new Date().toDateString()
  }

  function changeMonth(direction: number) {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
    setSelectedDay(null)
  }

  // 🔥 CALENDARI LABORAL (DILL → DIV)
  function getCalendarDays() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    let startDay = (firstDay.getDay() + 6) % 7

    const totalDays = new Date(year, month + 1, 0).getDate()

    const days: (Date | null)[] = []

    for (let i = 0; i < startDay && i < 5; i++) {
      days.push(null)
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i)
      const day = date.getDay()

      if (day !== 0 && day !== 6) {
        days.push(date)
      }
    }

    return days
  }

  function formatMonthYear(date: Date) {
    const parts = date.toLocaleDateString("ca-ES", {
      month: "long",
      year: "numeric"
    })
    return parts.charAt(0).toUpperCase() + parts.slice(1)
  }

  // 🔥 EXTREURE VISITES
  const visits = jobs.flatMap(job => {
    return (job.visits || [])
      .filter((v: any) => v.status !== "CANCELADA")
      .map((v: any) => ({
        job,
        visit: v,
        date: getVisitDateTime(v)
      }))
  })

  const sorted = visits
    .filter(v => v.date)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const filtered = sorted.filter(item => {
    const dt = item.date
    if (!dt) return false

    if (filter === "TODAY") return isToday(dt)
    if (filter === "TOMORROW") return isTomorrow(dt)
    if (filter === "WEEK") return isThisWeek(dt)
    if (filter === "MONTH") return true

    return true
  })

  const visitsOfSelectedDay = selectedDay
    ? visits.filter(v =>
        v.date?.toDateString() === selectedDay.toDateString()
      )
    : []

  function getVisitsInfoByDay(day: Date) {
    const dayVisits = visits.filter(v =>
      v.date?.toDateString() === day.toDateString()
    )

    const colors = dayVisits.map(v => {
      if (v.job.status === "URGENT") return "#ef4444"
      if (v.job.status === "PENDENTS") return "#eab308"
      if (v.job.status === "PROGRAMAT") return "#3b82f6"
      if (v.job.status === "FETES") return "#22c55e"
      return "#999"
    })

    return {
      count: dayVisits.length,
      colors
    }
  }

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>

      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>
        Agenda
      </h1>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "AVUI", value: "TODAY" },
          { label: "DEMÀ", value: "TOMORROW" },
          { label: "SETMANA", value: "WEEK" },
          { label: "MES", value: "MONTH" }
        ].map(btn => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            style={{
              padding: "10px 15px",
              background: filter === btn.value ? "#111" : "#fff",
              color: filter === btn.value ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 🔥 TODAY / TOMORROW */}
      {(filter === "TODAY" || filter === "TOMORROW") && (
        filtered.length > 0 ? (
          filtered.map((item, i) => (
            <JobCard
              key={i}
              job={{ ...item.job, visits: [item.visit] }}
              onClick={() => router.push(`/jobs/${item.job.id}`)}
            />
          ))
        ) : (
          <div style={{ color: "#666" }}>No hi ha visites</div>
        )
      )}

      {/* 🔥 WEEK */}
      {filter === "WEEK" && (
        Object.entries(
          filtered.reduce((acc: any, item: any) => {
            const day = item.date.toDateString()
            if (!acc[day]) acc[day] = []
            acc[day].push(item)
            return acc
          }, {})
        ).map(([day, items]: any) => (
          <div key={day} style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {new Date(day).toLocaleDateString("ca-ES", {
                weekday: "long",
                day: "numeric",
                month: "long"
              })}
            </div>

            {items.map((item: any, i: number) => (
              <JobCard
                key={i}
                job={{ ...item.job, visits: [item.visit] }}
                onClick={() => router.push(`/jobs/${item.job.id}`)}
              />
            ))}
          </div>
        ))
      )}

      {/* 🔥 MONTH */}
      {filter === "MONTH" && (
        <>
          {/* HEADER */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}>
            <button onClick={() => changeMonth(-1)}>←</button>
            <div style={{ fontWeight: "bold" }}>
              {formatMonthYear(currentDate)}
            </div>
            <button onClick={() => changeMonth(1)}>→</button>
          </div>

          {/* DIES SETMANA */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            marginBottom: "8px",
            fontSize: "11px",
            color: "#666",
            textAlign: "center"
          }}>
            {["DILL", "DIM", "DIC", "DIJ", "DIV"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          {/* GRID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px"
          }}>
            {getCalendarDays().map((day, i) => {

              if (!day) return <div key={i} />

              const info = getVisitsInfoByDay(day)
              const isSelected =
                selectedDay?.toDateString() === day.toDateString()
              const isToday = isTodayDate(day)

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    height: "70px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: isSelected ? "#111" : "#fff",
                    color: isSelected ? "#fff" : "#000",
                    border: isToday ? "2px solid #000" : "1px solid #eee",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  <div>{day.getDate()}</div>

                  {info.count > 0 && (
                    <div style={{ fontSize: "10px" }}>
                      {info.count}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* DETALL DIA */}
          {selectedDay && (
            <div style={{
              marginTop: "20px",
              background: "#fff",
              padding: "15px",
              border: "1px solid #eee",
              borderRadius: "10px"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {selectedDay.toLocaleDateString("ca-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long"
                })}
              </div>

              {visitsOfSelectedDay.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    {item.job.title} - {item.job.client} - {formatTime(item.visit.time)}
                  </div>

                  {item.job.status === "FETES" && (
                    <Check size={14} />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </main>
  )
}