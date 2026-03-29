"use client"

import { User, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function TopBar() {

  const router = useRouter()

  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)

    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      width: "100%",
      background: "#ffffff",
      borderBottom: "1px solid #e5e5e5",
      padding: "12px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      {/* ESQUERRA */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px"
      }}>
        
        {/* STATUS */}
        <div style={{
          width: "8px",
          height: "8px",
          background: "#22c55e",
          borderRadius: "50%"
        }} />

        {/* APP NAME */}
        <div style={{
          fontWeight: 600,
          fontSize: "15px",
          color: "#111"
        }}>
          Fixly
        </div>

        {/* USER */}
        <div
          onClick={() => router.push("/profile")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#666"
          }}
        >
          <User size={16} />
        </div>

      </div>

      {/* DRETA */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#666",
        fontSize: "13px"
      }}>
        
        {/* DATA */}
        <div>
          {new Date().toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "short"
          })} · {new Date().toLocaleTimeString("ca-ES", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>

        {/* WIFI */}
        {isOnline ? (
          <Wifi size={14} color="#22c55e" />
        ) : (
          <div style={{ position: "relative" }}>
            <WifiOff size={14} color="#ef4444" />
            <div style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              fontSize: "8px",
              color: "#ef4444",
              fontWeight: "bold"
            }}>
              ×
            </div>
          </div>
        )}

      </div>

    </div>
  )
}