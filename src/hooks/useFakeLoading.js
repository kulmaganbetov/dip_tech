import { useEffect, useState } from 'react'

// Tiny helper to show skeletons briefly on page mount — pure UX polish.
export function useFakeLoading(ms = 500) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(id)
  }, [ms])
  return loading
}
