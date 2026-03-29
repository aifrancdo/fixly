"use client"

import { useRouter, usePathname } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <div style={{ padding: "15px" }}>
      <button
        className="win-button"
        onClick={() => router.back()}
        style={{
          padding: "10px 14px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ← Tornar
      </button>
    </div>
  )
}