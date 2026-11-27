import { hasTimeTrackingNeed, recommend, type Answers } from '../recommend.ts'
import { ToolIcon } from '../ToolIcon.tsx'
import { colorOf, GOALS, TOOLS, type Goal } from '../tools.ts'

type Option<K extends keyof Answers> = { value: NonNullable<Answers[K]>; label: string }
// `goals` limits a question to the goals it changes the answer for; `q` may be worded per goal.
const QUESTIONS: { [K in keyof Answers]-?: { q: string | Partial<Record<Goal, string>>; goals?: Goal[]; options: Option<K>[] } } = {
  goal: {
    q: 'What do you want to fix first? Time tracking is optional.',
    options: (Object.keys(GOALS) as Goal[]).map((g) => ({ value: g, label: GOALS[g].name })),
  },
  timeBilling: {
    q: 'Do you need to submit timesheets or bill clients by the hour?',
    goals: ['time'],
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
  },
  timeEstimates: {
    q: 'Do inaccurate task estimates cause problems you want past time records to help fix?',
    goals: ['time'],
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
  },
  timeInsight: {
    q: 'Do you have a concrete question about where work time goes that you plan to act on?',
    goals: ['time'],
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
  },
  timeFocus: {
    q: 'Has a running timer reliably helped you focus enough to justify recording your work time?',
    goals: ['time'],
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
  },
  who: {
    q: 'Who is it for?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'team', label: 'My team' },
    ],
  },
  forget: {
    q: {
      time: 'Do you forget to start the timer?',
      notes: 'Do you lose thoughts before you write them down?',
      tasks: 'Do to-dos slip away before you write them down?',
      habits: 'Do you forget to do — or log — your habits?',
    },
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
    q: {
      time: 'Seeing every minute of your day logged makes you…',
      habits: 'A broken streak makes you…',
    },
    goals: ['time', 'habits'],
    options: [
      { value: 'motivated', label: 'motivated' },
      { value: 'anxious', label: 'anxious' },
    ],
  },
  data: {
    q: 'Where should your data live?',
    goals: ['notes', 'tasks', 'habits'], // no time tracker here stores data locally
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

const TIME_SCREENING_QUESTIONS: (keyof Answers)[] = ['timeBilling', 'timeEstimates', 'timeInsight', 'timeFocus']

export function Chooser({ answers, onChange }: { answers: Answers; onChange: (a: Answers) => void }) {
  const scores = recommend(answers)
  const first = scores[0]
  const noTimeTrackingNeeded = answers.goal === 'time' && !hasTimeTrackingNeed(answers)
  const visibleOtherQuestions = (Object.keys(QUESTIONS) as (keyof Answers)[]).filter((k) => {
    if (k === 'goal' || TIME_SCREENING_QUESTIONS.includes(k)) return false
    const question = QUESTIONS[k]
    if (question.goals && !question.goals.includes(answers.goal)) return false
    if (answers.goal === 'time' && !hasTimeTrackingNeed(answers)) return false
    return true
  })
  const renderQuestion = (k: keyof Answers) => {
    const { q } = QUESTIONS[k]
    return (
      <fieldset key={k}>
        <legend className="mb-2 text-sm text-ink-2">{typeof q === 'string' ? q : q[answers.goal]}</legend>
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
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        {renderQuestion('goal')}
        {answers.goal === 'time' && (
          <div className="space-y-4 rounded-xl border border-time/30 bg-time/5 p-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">Does tracking solve a real problem?</h3>
              <p className="mt-1 text-sm text-muted">A few quick checks decide whether a timer would be useful at all.</p>
            </div>
            <div className="space-y-3 rounded-lg bg-surface/70 p-3 text-sm text-ink-2">
              <p><strong className="text-ink">You don’t have to track everything.</strong> If you work solo and nobody needs a timesheet, a task list or an end-of-day note like “fixed the bug” may be enough. You can leave routine things like breaks, meals, email, and chores untracked.</p>
              <p><strong className="text-ink">If you have ADHD,</strong> a timer can be a start cue, not a score: try it for one task, such as 20 minutes to begin a report, and keep it only if it helps you get going.</p>
              <p><strong className="text-ink">If tracking makes you anxious,</strong> you don’t need minute-by-minute proof that you were productive. Track only what answers a real question, such as billable client time or how long one kind of task takes.</p>
            </div>
            <div className="space-y-4">
              {TIME_SCREENING_QUESTIONS.map(renderQuestion)}
            </div>
          </div>
        )}
        {visibleOtherQuestions.map(renderQuestion)}
      </div>

      <div className="rounded-xl bg-surface p-5 ring-1 ring-white/10" aria-live="polite">
        {noTimeTrackingNeeded ? (
          <>
            <p className="text-xs uppercase tracking-wide text-muted">Best fit for time tracking</p>
            <p className="mt-1 text-3xl font-semibold">You probably don’t need a time tracker</p>
            <p className="mt-2 text-ink-2">None of your answers points to a concrete decision or requirement that time tracking would improve. Focus on finished work and deadlines; reconsider if one of these needs changes.</p>
          </>
        ) : first ? (
          <>
            <p className="text-xs uppercase tracking-wide text-muted">Best fit for {GOALS[answers.goal].name.toLowerCase()}</p>
            <p className="mt-1 flex items-center gap-3 text-3xl font-semibold">
              <ToolIcon id={first.id} size={28} />
              {TOOLS[first.id].name}
            </p>
            <p className="mt-2 text-ink-2">{TOOLS[first.id].tagline}</p>
          </>
        ) : null}

        {!noTimeTrackingNeeded && <ul className="mt-6 space-y-3" aria-label="Fit score per tool">
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
        </ul>}

        {first && !noTimeTrackingNeeded && <>
          <h4 className="mt-6 text-sm font-medium">Why {TOOLS[first.id].name}</h4>
          <ul className="mt-2 space-y-1 text-sm text-ink-2">
            {first.why.length ? first.why.map((w) => <li key={w} className={w.startsWith('+') ? '' : 'text-muted'}>{w}</li>) : <li className="text-muted">A solid default for this goal.</li>}
          </ul>
        </>}
        <p className="mt-5 text-xs text-muted">Guidance based on how you work, not a diagnosis or medical advice.</p>
      </div>
    </div>
  )
}
