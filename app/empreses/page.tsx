"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"

export default function EmpresesPage() {

  const router = useRouter()

  const [jobs, setJobs] = useState<any[]>([])
  const [newEmpresa, setNewEmpresa] = useState("")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs") || "[]")
    setJobs(stored)
  }, [])

  // 🔥 extreure empreses úniques
  const empreses = Array.from(
    new Set(jobs.map(j => j.empresa).filter(Boolean))
  )

  // ➕ afegir empresa manual (simple)
  const addEmpresa = () => {
    if (!newEmpresa.trim()) return

    const exists = empreses.includes(newEmpresa)
    if (exists) return

    // fake push (no guardem encara com entitat real)
    setJobs(prev => [...prev, { empresa: newEmpresa }])
    setNewEmpresa("")
  }

  return (
    <main style={{
      padding: "20px",
      maxWidth: "700px",
      margin: "0 auto"
    }}>

      {/* TÍTOL */}
      <h1 style={{
        fontSize: "28px",
        marginBottom: "20px"
      }}>
        Empreses
      </h1>

      {/* ➕ NOVA EMPRESA */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>

        <input
          value={newEmpresa}
          onChange={(e) => setNewEmpresa(e.target.value)}
          placeholder="Nova empresa..."
          style={{
            flex: 1,
            padding: "12px",
            border: "2px solid #000",
            borderRadius: "10px"
          }}
        />

        <button
          onClick={addEmpresa}
          style={{
            padding: "12px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Afegir
        </button>

      </div>

      {/* LLISTA */}
      {empreses.length === 0 && (
        <div style={{ color: "#666" }}>
          No hi ha empreses
        </div>
      )}

      {empreses.map((empresa, i) => {

        const count = jobs.filter(j => j.empresa === empresa).length

        return (
          <div
            key={i}
            onClick={() => router.push(`/jobs?empresa=${empresa}`)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              marginBottom: "10px",
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <Building2 size={18} />
              <div style={{ fontWeight: "600" }}>
                {empresa}
              </div>
            </div>

            <div style={{
              fontSize: "12px",
              color: "#666"
            }}>
              {count} feines
            </div>

          </div>
        )
      })}

    </main>
  )
}