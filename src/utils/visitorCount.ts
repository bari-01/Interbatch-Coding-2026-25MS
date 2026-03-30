export async function getVisitorCount(): Promise<number> {
  try {
    const res = await fetch('https://api.countapi.xyz/hit/slashdot-os-25ms/visits')
    const data = await res.json()
    return data.value ?? 0
  } catch {
    return 0
  }
}