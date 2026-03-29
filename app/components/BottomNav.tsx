"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Briefcase, Calendar, FileText, User } from "lucide-react"

export default function BottomNav() {

  const router = useRouter()
  const pathname = usePathname()

  const items = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Feines", path: "/jobs", icon: Briefcase },
    { label: "Agenda", path: "/agenda", icon: Calendar },
    { label: "Factures", path: "/factures", icon: FileText },
    { label: "Empreses", path: "/empreses", icon: User }
  ]

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "#ffffff",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-around",
      padding: "8px 0",
      zIndex: 1000
    }}>
      {items.map(item => {

        const active = pathname === item.path
        const Icon = item.icon

        return (
          <div
            key={item.label}
            onClick={() => router.push(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: active ? "#000" : "#666",
              fontWeight: active ? "bold" : "normal",
              opacity: active ? 1 : 0.7
            }}
          >

            {/* ICONA CORRECTA */}
            <Icon size={20} />

            {/* TEXT */}
            <div style={{ fontSize: "12px" }}>
              {item.label}
            </div>

            {/* LINIA ACTIVA */}
            {active && (
              <div style={{
                marginTop: "4px",
                width: "20px",
                height: "2px",
                background: "#000"
              }} />
            )}

          </div>
        )
      })}
    </div>
  )
}