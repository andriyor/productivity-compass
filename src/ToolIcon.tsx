import type { ReactNode } from 'react'
import { siApple, siClickup, siClockify, siLinear, siLogseq, siNotion, siObsidian, siRescuetime, siThings, siTodoist, siToggl } from 'simple-icons'
import type { ToolId } from './tools.ts'

// Lunatask and Griply have no Simple Icons entry, so their logos are redrawn here.
// Lunatask: a rainbow tile with a white check.
const LUNA_STRIPES = ['#ef5350', '#ff9800', '#fdd835', '#66bb6a', '#42a5f5', '#ab47bc']
const LUNATASK = (
  <>
    <clipPath id="lunatask-tile">
      <rect x={1} y={1} width={22} height={22} rx={5} />
    </clipPath>
    <g clipPath="url(#lunatask-tile)">
      {LUNA_STRIPES.map((c, i) => (
        <rect key={c} x={1 + i * (22 / 6)} y={1} width={22 / 6 + 0.1} height={22} fill={c} />
      ))}
    </g>
    <path d="M6.5 12.5l3.8 3.8L17.8 8" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
  </>
)
// Griply: a purple tile with a white figure raising its arms.
const GRIPLY = (
  <>
    <rect x={1} y={1} width={22} height={22} rx={5} fill="#5b4fd6" />
    <circle cx={13.5} cy={7.5} r={2.4} fill="none" stroke="#fff" strokeWidth={1.8} />
    <path d="M12 18c2-2.6 4-4.4 6-5.4" fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.6} strokeLinecap="round" />
    <path d="M6 12.5c2.2 2.6 4 4.6 6 5.5" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
  </>
)

// Brand colours from Simple Icons, except where they vanish on the dark surface (< 3:1):
// Notion / Apple black and RescueTime navy -> ink.
const ICONS: Record<ToolId, { path: string; color: string } | { node: ReactNode }> = {
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
  clickup: { path: siClickup.path, color: `#${siClickup.hex}` },
  lunatask: { node: LUNATASK },
  griply: { node: GRIPLY },
}

// Works both in HTML and nested inside another <svg> (x/y position it there).
export function ToolIcon({ id, size = 16, x, y, className }: { id: ToolId; size?: number; x?: number; y?: number; className?: string }) {
  const icon = ICONS[id]
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill={'color' in icon ? icon.color : undefined} aria-hidden className={className}>
      {'node' in icon ? icon.node : <path d={icon.path} fillRule="evenodd" />}
    </svg>
  )
}
