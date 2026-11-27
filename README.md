# Productivity Compass

**Live: https://productivity-compass.vercel.app/**

A visual guide to choosing tools for **notes**, **tasks** and **habits**, with **optional time tracking** for billing clients, refining estimates, finding where your hours go, or focusing with a timer. It matches tools to how you work: alone or in a team, scattered (ADHD-ish) or anxious. It covers Toggl Track, Clockify, RescueTime, Apple Notes, Obsidian, Logseq, Notion, Things 3, Todoist, Linear, ClickUp, Lunatask, Griply, Loop Habit Tracker, Streaks and Habitica.

## What's on the page

1. **Four possible jobs, four questions.** A Venn diagram of which jobs each tool covers. Pick tools for the jobs you actually have; time tracking helps when it answers a specific question or requirement. Tasks is the hub; the overlaps are the all-in-ones (Obsidian, Lunatask, Notion, Logseq, Griply, ClickUp). Hover a tool to highlight its circles.
2. **It depends on your brain.** ADHD-ish and anxious-ish working styles side by side: starting, options, tracking, habits, and what helps. Working styles, not diagnoses.
3. **The map.** Structure (freeform → structured) against setup effort, with a "tinker zone" at the top and "open and go" at the bottom. Hover a tool to see when to use it and when to avoid it.
4. **Which one for me?** Pick a goal first. Notes, tasks and habits start by checking whether your current method works; time tracking asks what you need it for and frames the log as observation, not a productivity score. The recommendation and map update as you click.
5. **Possible toolkit.** Your answers above applied across every job. Keep your current method where it works; time tracking stays optional.
6. **Cheat sheet.** "If this sounds like you…" sentences against each tool, rated great / good / meh / —. Filter by job to compare just those tools; hover a row to see why.

The fit scores are hand-tuned weights for guidance, not research or medical advice. Tool facts were written in late 2026 and can drift as products change.

## Run it

```sh
pnpm install
pnpm dev       # http://localhost:5173
pnpm test      # scoring heuristics (node:test, needs Node ≥ 22.18)
pnpm build
```

## Built with

React, Vite, Tailwind CSS v4 and hand-written SVG, with no chart library. Most logos come from [Simple Icons](https://simpleicons.org); Lunatask, Griply, Loop, Streaks and Habitica aren't there, so simplified versions are drawn in `src/ToolIcon.tsx`.

Each tool is coloured by its main job: blue for time tracking, orange for notes, green for tasks, pink for habits. The goal name always appears next to the colour, so colour never carries meaning alone.

## Where things live

| File | What |
|---|---|
| `src/tools.ts` | Each tool's goals, traits (setup, capture, privacy, team, price) and when to use or avoid it |
| `src/recommend.ts` | The chooser's scoring heuristics and the "you" dot position |
| `src/sections/` | One component per section of the page |
| `src/ToolIcon.tsx` | Brand icons and colours |
