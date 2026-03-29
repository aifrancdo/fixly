"use client"

import React from "react"

export default function StatCard({
  title,
  count,
  color,
  icon,
  onClick
}: any) {
  return (
    <div
      onClick={onClick}
      style={{
        height: "120px", // 🔥 FIXEM altura (clau)
        padding: "12px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "12px",

        background: "#fff",
        border: "1px solid #eee",
        borderTop: `3px solid ${color}`,

        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.15s ease",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.12)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
      }}
    >

      {/* 🔝 ICON (mateixa altura sempre) */}
      <div style={{
        height: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {icon}
      </div>

      {/* 🔢 NUMERO */}
      <div style={{
        fontSize: "28px",
        fontWeight: "bold",
        lineHeight: "28px"
      }}>
        {count}
      </div>

      {/* 📝 TEXT (mateixa altura sempre) */}
      <div style={{
        fontSize: "12px",
        color: "#666",
        height: "16px"
      }}>
        {title}
      </div>

    </div>
  )
}