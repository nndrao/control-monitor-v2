/**
 * useResizable Hook
 *
 * Encapsulates panel resize logic with mouse and touch support.
 * Extracts resize concerns from parent components for clean separation.
 */

import { useState, useRef, useEffect, useCallback } from 'react'

interface UseResizableOptions {
  /** Default width in pixels */
  defaultWidth: number
  /** Minimum width in pixels */
  minWidth?: number
  /** Offset from window edge for max width calculation */
  maxWidthOffset?: number
}

interface UseResizableReturn {
  width: number
  isResizing: boolean
  handleResizeStart: (e: React.MouseEvent) => void
  handleTouchResizeStart: (e: React.TouchEvent) => void
}

export function useResizable({
  defaultWidth,
  minWidth = 400,
  maxWidthOffset = 200,
}: UseResizableOptions): UseResizableReturn {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startX.current = e.clientX
      startWidth.current = width
    },
    [width]
  )

  const handleTouchResizeStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startX.current = e.touches[0].clientX
      startWidth.current = width
    },
    [width]
  )

  useEffect(() => {
    if (!isResizing) return

    const handleMove = (clientX: number) => {
      const deltaX = startX.current - clientX
      const maxWidth = window.innerWidth - maxWidthOffset
      setWidth(Math.max(minWidth, Math.min(maxWidth, startWidth.current + deltaX)))
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }
    const handleEnd = () => setIsResizing(false)
    const preventContextMenu = (e: Event) => e.preventDefault()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('contextmenu', preventContextMenu)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, minWidth, maxWidthOffset])

  return { width, isResizing, handleResizeStart, handleTouchResizeStart }
}
