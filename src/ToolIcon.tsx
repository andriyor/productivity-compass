import type { ReactNode } from 'react'
import { siApple, siClickup, siClockify, siLinear, siLogseq, siNotion, siObsidian, siRescuetime, siThings, siTodoist, siToggl } from 'simple-icons'
import type { ToolId } from './tools.ts'

// Apps without a Simple Icons entry get their logos redrawn here (simplified).
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
// Loop: a blue disc with a white circular arrow.
const LOOP = (
  <>
    <circle cx={12} cy={12} r={11} fill="#1e88e5" />
    <path d="M15.2 8.4A5.4 5.4 0 1 1 10.4 7.7" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
    <path d="M8 5.2l5 .6-3 4.1z" fill="#fff" />
  </>
)
// Streaks: an orange tile with a progress ring around an S.
const STREAKS = (
  <>
    <rect x={1} y={1} width={22} height={22} rx={5} fill="#f2684a" />
    <circle cx={12} cy={12} r={7} fill="none" stroke="#fff" strokeWidth={1.6} />
    <path d="M12 5A7 7 0 0 0 7 7.1" fill="none" stroke="#8c2d1c" strokeWidth={1.6} />
    <text x={12} y={15.4} fontSize={9.5} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily="system-ui, sans-serif">S</text>
  </>
)
// Habitica: a purple pixel-edged tile with a wing (its griffin, simplified).
const HABITICA = (
  <>
    <rect x={1} y={1} width={22} height={22} rx={5} fill="#a993ed" />
    <rect x={3.5} y={3.5} width={17} height={17} rx={3.5} fill="#4f2a93" />
    {[[5, 9], [7, 11], [5, 13], [7, 15]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={2} height={2} fill="#c9b8ff" />)}
    <path d="M10 18c.8-5.5 4.2-9.2 9-10.6-1.6 3-2.3 6.6-5 10.6z" fill="#c9b8ff" />
  </>
)

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
  loop: { node: LOOP },
  streaks: { node: STREAKS },
  habitica: { node: HABITICA },
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
