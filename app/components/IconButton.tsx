"use client"

import React from "react"

export default function IconButton({
  children,
  onClick,
  variant = "default"
}: any) {

  const styles: any = {
    default: {
      bg: "#fff",
      border: "#000",
      color: "#000"
    },
    danger: {
      bg: "#fee2e2",
      border: "#ef4444",
      color: "#ef4444"
    }
  }

  const current = styles[variant] || styles.default

  return (
    <button
      onClick={onClick}
      style={{
        width: "36px",
        height: "36px",
        background: current.bg,
        border: `1px solid ${current.border}`,
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {children}
    </button>
  )
}