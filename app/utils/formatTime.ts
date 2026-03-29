export function formatTime(time?: string) {
  if (!time) return "--:--"

  const [h, m] = time.split(":")
  const hour = Number(h)

  // si minuts són 00 → només hora
  if (m === "00") return `${hour}h`

  return `${hour}h${m}`
}