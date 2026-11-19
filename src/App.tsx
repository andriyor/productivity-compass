import { useState, type ReactNode } from 'react'
import { markerFor, recommend, type Answers } from './recommend.ts'
import { ToolIcon } from './ToolIcon.tsx'
import { GOALS, TOOL_IDS, TOOLS, type Goal } from './tools.ts'
import { Chooser } from './sections/Chooser.tsx'
import { FitMatrix } from './sections/FitMatrix.tsx'
import { Landscape } from './sections/Landscape.tsx'

const STYLES = [
  ['Starting', 'Forgets to start the timer or capture the idea', 'Hesitates to start until the system feels “right”'],
  ['Options', 'Novelty is fun — then the setup eats the week', 'Too many choices → freeze'],
  ['Tracking', 'Needs it automatic or it won’t happen', 'Minute-by-minute logs can feel like judgement'],
  ['What helps', 'Instant capture, background tracking, few steps', 'Opinionated defaults, one trusted place, private data'],
]

export default function App() {
  const [answers, setAnswers] = useState<Answers>({
    goal: 'notes',
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
        <p className="text-sm font-medium tracking-wide text-muted">PRODUCTIVITY COMPASS</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The best tool is the one <span className="text-notes">you’ll still use</span> next month.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          Pick a <b className="text-time">time tracker</b>, a <b className="text-notes">notes app</b> and a <b className="text-tasks">task manager</b> by how
          you work — alone or in a team, scattered or anxious — not by feature lists.
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

      <Section n="01" title="Three jobs, three questions" lead="Most people need one tool per job. Some tools cover two — that’s a bonus, not a requirement.">
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(GOALS) as Goal[]).map((g) => (
            <div key={g} className="rounded-xl bg-surface p-5 ring-1 ring-white/10" style={{ borderTop: `3px solid ${GOALS[g].color}` }}>
              <h3 className="font-semibold">{GOALS[g].name}</h3>
              <p className="mt-1 text-ink-2">“{GOALS[g].question}”</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-2">
                {TOOL_IDS.filter((id) => TOOLS[id].goals.includes(g)).map((id) => (
                  <li key={id} className="flex items-center gap-1.5">
                    <ToolIcon id={id} size={14} />
                    {TOOLS[id].name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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

      <Section n="04" title="Which one for me?" lead="Seven quick questions. The recommendation and the map update as you click.">
        <Chooser answers={answers} onChange={setAnswers} />
      </Section>

      <Section n="05" title="Your stack" lead="The same answers, applied to all three jobs.">
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(GOALS) as Goal[]).map((g) => {
            const best = recommend({ ...answers, goal: g })[0]
            return (
              <div key={g} className="rounded-xl bg-surface p-5 ring-1 ring-white/10" style={{ borderTop: `3px solid ${GOALS[g].color}` }}>
                <p className="text-xs uppercase tracking-wide text-muted">{GOALS[g].name}</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
                  <ToolIcon id={best.id} size={22} />
                  {TOOLS[best.id].name}
                </p>
                <p className="mt-2 text-sm text-ink-2">{TOOLS[best.id].tagline}</p>
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
