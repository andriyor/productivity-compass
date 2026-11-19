import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recommend, type Answers } from './recommend.ts'

const base: Answers = { goal: 'time', who: 'solo', forget: 'no', options: 'neutral', watched: 'motivated', data: 'cloud', budget: 'paid' }
const top = (a: Partial<Answers>) => recommend({ ...base, ...a })[0].id

test('forgetful solo who is fine being tracked → RescueTime', () => {
  assert.equal(top({ forget: 'yes' }), 'rescuetime')
})
test('forgetful but anxious about tracking → Toggl, not RescueTime', () => {
  assert.equal(top({ forget: 'yes', watched: 'anxious' }), 'toggl')
})
test('team time tracking on zero budget → Clockify', () => {
  assert.equal(top({ who: 'team', budget: 'free' }), 'clockify')
})
test('overwhelmed note-taker → Apple Notes', () => {
  assert.equal(top({ goal: 'notes', options: 'overwhelm' }), 'applenotes')
})
test('private tinkerer → Obsidian', () => {
  assert.equal(top({ goal: 'notes', options: 'tinker', data: 'local' }), 'obsidian')
})
test('team notes → Notion', () => {
  assert.equal(top({ goal: 'notes', who: 'team' }), 'notion')
})
test('team tasks → Linear or Notion in top two', () => {
  const ids = recommend({ ...base, goal: 'tasks', who: 'team' }).slice(0, 2).map((s) => s.id)
  assert.deepEqual(ids.sort(), ['linear', 'notion'])
})
test('only tools for the chosen goal, scores within 0..100', () => {
  for (const s of recommend({ ...base, goal: 'time', who: 'team', forget: 'yes', options: 'overwhelm', watched: 'anxious', data: 'local', budget: 'free' })) {
    assert.ok(['toggl', 'clockify', 'rescuetime'].includes(s.id))
    assert.ok(s.score >= 0 && s.score <= 100)
  }
})
