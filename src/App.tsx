import { useState, type ReactNode } from 'react'
import { siGithub } from 'simple-icons'
import { hasGoalNeed, markerFor, recommend, type Answers } from './recommend.ts'
import { ToolIcon } from './ToolIcon.tsx'
import { GOALS, TOOL_IDS, TOOLS, type Goal } from './tools.ts'
import { Chooser } from './sections/Chooser.tsx'
import { FitMatrix } from './sections/FitMatrix.tsx'
import { Landscape } from './sections/Landscape.tsx'
import { Venn } from './sections/Venn.tsx'

const STYLES = [
  ['Starting', 'Forgets to start the timer or capture the idea', 'Hesitates to start until the system feels “right”'],
  ['Options', 'Novelty is fun — then the setup eats the week', 'Too many choices → freeze'],
  ['Tracking', 'Needs it automatic or it won’t happen', 'Minute-by-minute logs can feel like judgement'],
  ['Habits', 'Streak apps work great — for two weeks', 'One broken streak feels like failure'],
  ['What helps', 'Instant capture, background tracking, few steps', 'Opinionated defaults, one trusted place, private data'],
]

export default function App() {
  const [answers, setAnswers] = useState<Answers>({
    goal: 'notes',
    notesNeed: 'yes',
    tasksNeed: 'yes',
    habitsNeed: 'yes',
    timeBilling: 'no',
    timeEstimates: 'no',
    timeInsight: 'no',
    timeFocus: 'no',
    who: 'solo',
    forget: 'yes',
    options: 'overwhelm',
    watched: 'motivated',
    data: 'cloud',
    budget: 'free',
  })

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="pt-16 pb-12">
        <div className="flex items-center justify-between text-sm font-medium tracking-wide text-muted">
          <p>PRODUCTIVITY COMPASS</p>
          <a
            href="https://github.com/andriyor/productivity-compass"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
              <path d={siGithub.path} />
            </svg>
            GitHub
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The best tool is the one <span className="text-notes">you’ll still use</span> next month.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          Pick tools for the jobs you actually need — <b className="text-notes">notes</b>, <b className="text-tasks">tasks</b> and{' '}
          <b className="text-habits">habits</b> — by how you work, not by feature lists. <b className="text-time">Time tracking is optional</b>: use it when you have a clear reason, like billing or estimating.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
          {TOOL_IDS.map((id) => (
            <li key={id} className="flex items-center gap-2">
              <ToolIcon id={id} size={20} />
              {TOOLS[id].name}
            </li>
          ))}
        </ul>
      </header>

      <Section
        n="01"
        title="Four possible jobs, four questions"
        lead="Pick tools for the jobs you actually have. Time tracking helps when it answers a specific question or requirement; tools in the overlaps cover more than one job."
      >
        <Venn />
      </Section>

      <Section
        n="02"
        title="It depends on your brain"
        lead="Working styles, not diagnoses: plenty of people without a label recognise themselves here. The questions below are built around these patterns."
      >
        <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="p-3 text-left font-normal text-muted" />
                <th className="p-3 text-left font-semibold">ADHD-ish</th>
                <th className="p-3 text-left font-semibold">Anxious-ish</th>
              </tr>
            </thead>
            <tbody>
              {STYLES.map(([k, a, b]) => (
                <tr key={k} className="border-t border-grid">
                  <td className="p-3 text-muted">{k}</td>
                  <td className="p-3 text-ink-2">{a}</td>
                  <td className="p-3 text-ink-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="03" title="The map" lead="Freeform to structured, left to right; how much you must set up, bottom to top. The “you” dot moves with your answers in 04.">
        <Landscape marker={markerFor(answers)} />
      </Section>

      <Section n="04" title="Which one for me?" lead="Pick a goal first. Notes, tasks and habits start by checking whether your current method works; time tracking asks what you need it for. The recommendation and map update as you click.">
        <Chooser answers={answers} onChange={setAnswers} />
        <div className="mt-8 overflow-hidden rounded-xl bg-surface ring-1 ring-white/10">
          <div className="p-4">
            <h3 className="font-semibold">Interview with a Productivity Freak in 2026</h3>
            <p className="mt-1 text-sm text-muted">A satirical take on productivity systems and the urge to track everything.</p>
          </div>
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/guvFKt_Zjqw?cc_load_policy=1&cc_lang_pref=en"
              title="Interview with a Productivity Freak in 2026"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </Section>

      <Section n="05" title="Possible toolkit" lead="Your answers above applied across every job. Keep your current method where it works; time tracking stays optional.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(GOALS) as Goal[]).map((g) => {
            const best = recommend({ ...answers, goal: g })[0]
            const noNeed = !hasGoalNeed(answers, g)
            return (
              <div key={g} className="rounded-xl bg-surface p-5 ring-1 ring-white/10" style={{ borderTop: `3px solid ${GOALS[g].color}` }}>
                <p className="text-xs uppercase tracking-wide text-muted">{g === 'time' ? 'Optional · Time tracking' : GOALS[g].name}</p>
                {noNeed ? (
                  <>
                    <p className="mt-2 text-xl font-semibold">{g === 'time' ? 'You probably don’t need a time tracker' : 'Your current setup may be enough'}</p>
                    <p className="mt-2 text-sm text-ink-2">{g === 'time'
                      ? 'Pick “Time tracking” in 04 if you bill hours, refine estimates, see where your hours go, or use a timer to focus.'
                      : `You said your current way of handling ${GOALS[g].name.toLowerCase()} works for you.`}</p>
                  </>
                ) : best && (
                  <>
                    <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
                      <ToolIcon id={best.id} size={22} />
                      {TOOLS[best.id].name}
                    </p>
                    <p className="mt-2 text-sm text-ink-2">{TOOLS[best.id].tagline}</p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <Section n="06" title="Cheat sheet" lead="Find the sentence that sounds like you.">
        <FitMatrix />
      </Section>
    </main>
  )
}

function Section({ n, title, lead, children }: { n: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section className="border-t border-grid py-14">
      <div className="mb-8 grid gap-2 md:grid-cols-[4rem_1fr]">
        <span className="font-mono text-sm text-muted">{n}</span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-3xl text-ink-2">{lead}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
