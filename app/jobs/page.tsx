"use client"

import dynamic from "next/dynamic"

const JobsContent = dynamic(() => import("./JobsContent"), {
  ssr: false
})

export default function JobsPage() {
  return <JobsContent />
}
