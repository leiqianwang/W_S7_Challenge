import React, { useEffect, useState } from 'react'

/** Live countdown until editableUntil (ISO string). Returns null if expired. */
export function useEditCountdown(editableUntil) {
  const [remainingMs, setRemainingMs] = useState(() => calcRemaining(editableUntil))

  useEffect(() => {
    setRemainingMs(calcRemaining(editableUntil))
    if (!editableUntil) return undefined

    const id = setInterval(() => {
      setRemainingMs(calcRemaining(editableUntil))
    }, 1000)

    return () => clearInterval(id)
  }, [editableUntil])

  return remainingMs
}

function calcRemaining(editableUntil) {
  if (!editableUntil) return 0
  return Math.max(0, new Date(editableUntil).getTime() - Date.now())
}

export function formatCountdown(ms) {
  if (ms <= 0) return '0:00'
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export const SIZE_LABELS = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
}

export const SIZE_WINDOWS = {
  S: 10,
  M: 15,
  L: 20,
}
