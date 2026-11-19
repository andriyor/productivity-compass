import { siApple, siClockify, siLinear, siLogseq, siNotion, siObsidian, siRescuetime, siThings, siTodoist, siToggl } from 'simple-icons'
import type { ToolId } from './tools.ts'

// Brand colours from Simple Icons, except where they vanish on the dark surface (< 3:1):
// Notion / Apple black and RescueTime navy -> ink.
const ICONS: Record<ToolId, { path: string; color: string }> = {
  toggl: { path: siToggl.path, color: `#${siToggl.hex}` },
  clockify: { path: siClockify.path, color: `#${siClockify.hex}` },
  rescuetime: { path: siRescuetime.path, color: '#f0efec' },
  applenotes: { path: siApple.path, color: '#f0efec' },
  obsidian: { path: siObsidian.path, color: '#a78bfa' },
  logseq: { path: siLogseq.path, color: `#${siLogseq.hex}` },
  notion: { path: siNotion.path, color: '#f0efec' },
  things: { path: siThings.path, color: `#${siThings.hex}` },
  todoist: { path: siTodoist.path, color: `#${siTodoist.hex}` },
  linear: { path: siLinear.path, color: '#8b93ff' },
}

// Works both in HTML and nested inside another <svg> (x/y position it there).
export function ToolIcon({ id, size = 16, x, y, className }: { id: ToolId; size?: number; x?: number; y?: number; className?: string }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill={ICONS[id].color} aria-hidden className={className}>
      <path d={ICONS[id].path} fillRule="evenodd" />
    </svg>
  )
}
