import { TOOL_IDS, TOOLS, type Goal, type ToolId } from './tools.ts'

export type Answers = {
  goal: Goal
  who: 'solo' | 'team'
  forget: 'yes' | 'no' // forgets timers / loses thoughts before capturing
  options: 'overwhelm' | 'neutral' | 'tinker'
  watched: 'motivated' | 'anxious' // how minute-by-minute tracking feels
  data: 'local' | 'cloud'
  budget: 'free' | 'paid'
}

export type Score = { id: ToolId; score: number; why: string[] }

// shortcut: hand-tuned heuristic weights for guidance, not research; tune with real user feedback.
export function recommend(a: Answers): Score[] {
  const out: Score[] = []
  for (const id of TOOL_IDS) {
    const t = TOOLS[id]
    if (!t.goals.includes(a.goal)) continue
    let score = 50
    const why: string[] = []
    const add = (n: number, w: string) => {
      score += n
      why.push((n > 0 ? '+ ' : '− ') + w)
    }

    if (t.goals[0] !== a.goal) add(-10, 'A side feature here, not its main job')

    if (a.who === 'team') {
      if (t.team === 3) add(25, 'Built for teams: sharing, permissions, admin')
      else if (t.team === 2) add(5, 'Light sharing is possible')
      else add(-30, 'Little or no collaboration')
    } else if (t.team === 3 && t.setup >= 0.4) {
      add(-10, 'Team features add weight you won’t use alone')
    }

    if (a.forget === 'yes') {
      if (t.auto === 2) add(30, 'Runs in the background — nothing to remember')
      else if (t.auto === 1) add(10, 'Reminds you when you forget to start')
      if (t.capture === 2) add(15, 'Capture in seconds, before the thought is gone')
      else if (t.capture === 0) add(-15, 'Slow to capture')
    }

    if (a.options === 'overwhelm') {
      if (t.setup <= 0.25) add(20, 'Works out of the box: few decisions')
      else if (t.setup >= 0.75) add(-30, 'Blank canvas with endless options can freeze you')
    } else if (a.options === 'tinker' && t.setup >= 0.75) {
      add(15, 'Deeply customisable — you’ll enjoy shaping it')
    }

    if (a.watched === 'anxious' && t.auto === 2) add(-30, 'Logs every minute; that record can feed anxiety')

    // No time tracker stores data locally, so this would only shift them all equally.
    if (a.data === 'local' && a.goal !== 'time') {
      if (t.local) add(20, 'Your data stays as files on your device')
      else if (t.e2e) add(10, 'End-to-end encrypted: synced, but only you can read it')
      else add(-10, 'Data lives on their servers')
    }

    if (a.budget === 'free' && !t.free) add(-25, 'Paid')

    out.push({ id, score: Math.max(0, Math.min(100, score)), why })
  }
  return out.sort((x, y) => y.score - x.score)
}

// Where "you" sit on the Landscape map (0..1 axes): structure → right, tolerance for setup → up.
export function markerFor(a: Answers) {
  const x = (a.who === 'team' ? 0.75 : 0.4) - (a.forget === 'yes' ? 0.1 : 0)
  const y = { overwhelm: 0.12, neutral: 0.45, tinker: 0.82 }[a.options]
  return { x, y }
}
