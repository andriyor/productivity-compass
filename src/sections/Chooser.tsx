import { recommend, type Answers } from '../recommend.ts'
import { ToolIcon } from '../ToolIcon.tsx'
import { colorOf, GOALS, TOOLS, type Goal } from '../tools.ts'

type Option<K extends keyof Answers> = { value: Answers[K]; label: string }
const QUESTIONS: { [K in keyof Answers]: { q: string; options: Option<K>[] } } = {
  goal: {
    q: 'What do you want to fix first?',
    options: (Object.keys(GOALS) as Goal[]).map((g) => ({ value: g, label: GOALS[g].name })),
  },
  who: {
    q: 'Who is it for?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'team', label: 'My team' },
    ],
  },
  forget: {
    q: 'Do you forget to start timers, or lose thoughts before you write them down?',
    options: [
      { value: 'no', label: 'Rarely' },
      { value: 'yes', label: 'All the time' },
    ],
  },
  options: {
    q: 'A tool with endless settings and layouts…',
    options: [
      { value: 'overwhelm', label: 'freezes me' },
      { value: 'neutral', label: 'is fine' },
      { value: 'tinker', label: 'is the fun part' },
    ],
  },
  watched: {
    q: 'Seeing every minute of your day logged makes you…',
    options: [
      { value: 'motivated', label: 'motivated' },
      { value: 'anxious', label: 'anxious' },
    ],
  },
  data: {
    q: 'Where should your data live?',
    options: [
      { value: 'cloud', label: 'Anywhere, synced' },
      { value: 'local', label: 'On my device' },
    ],
  },
  budget: {
    q: 'Budget',
    options: [
      { value: 'free', label: 'Free only' },
      { value: 'paid', label: 'Will pay for the right fit' },
    ],
  },
}

export function Chooser({ answers, onChange }: { answers: Answers; onChange: (a: Answers) => void }) {
  const scores = recommend(answers)
  const first = scores[0]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        {(Object.keys(QUESTIONS) as (keyof Answers)[]).map((k) => (
          <fieldset key={k}>
            <legend className="mb-2 text-sm text-ink-2">{QUESTIONS[k].q}</legend>
            <div className="flex flex-wrap gap-1 rounded-lg bg-surface p-1 ring-1 ring-white/10">
              {QUESTIONS[k].options.map((o) => {
                const on = answers[k] === o.value
                return (
                  <button
                    key={o.value}
                    aria-pressed={on}
                    onClick={() => onChange({ ...answers, [k]: o.value })}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition ${on ? 'bg-ink text-page shadow' : 'text-ink-2 hover:bg-raised'}`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="rounded-xl bg-surface p-5 ring-1 ring-white/10" aria-live="polite">
        <p className="text-xs uppercase tracking-wide text-muted">Best fit for {GOALS[answers.goal].name.toLowerCase()}</p>
        <p className="mt-1 flex items-center gap-3 text-3xl font-semibold">
          <ToolIcon id={first.id} size={28} />
          {TOOLS[first.id].name}
        </p>
        <p className="mt-2 text-ink-2">{TOOLS[first.id].tagline}</p>

        <ul className="mt-6 space-y-3" aria-label="Fit score per tool">
          {scores.map((s) => (
            <li key={s.id} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 text-sm">
              <span className="flex items-center gap-2 text-ink-2">
                <ToolIcon id={s.id} size={14} />
                {TOOLS[s.id].name}
              </span>
              <span className="h-3 rounded-full bg-grid">
                <span className="block h-full rounded-full transition-all duration-500" style={{ background: colorOf(s.id), width: `${s.score}%` }} />
              </span>
              <span className="text-right tabular-nums text-ink">{s.score}</span>
            </li>
          ))}
        </ul>

        <h4 className="mt-6 text-sm font-medium">Why {TOOLS[first.id].name}</h4>
        <ul className="mt-2 space-y-1 text-sm text-ink-2">
          {first.why.length ? first.why.map((w) => <li key={w} className={w.startsWith('+') ? '' : 'text-muted'}>{w}</li>) : <li className="text-muted">A solid default for this goal.</li>}
        </ul>
        <p className="mt-5 text-xs text-muted">Guidance based on how you work, not a diagnosis or medical advice.</p>
      </div>
    </div>
  )
}
