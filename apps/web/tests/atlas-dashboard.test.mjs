import { describe, expect, test } from 'bun:test'

import {
  matchCourseId,
  findRun,
  getCourseProgress,
  getStartedCourseIds,
  getInProgressCourses,
  getNotStartedCourses,
  getCompletedCourses,
  getOverallProgress,
  isFreePlan,
  getNextSteps,
  inferAcademy,
  groupByAcademy,
} from '../components/Atlas/atlasProgress.ts'

const course = (id, over = {}) => ({ course_uuid: `course_${id}`, course_id: id, name: `C${id}`, ...over })

const trail = (runs) => ({ runs })

describe('matchCourseId', () => {
  test('prefers course_id when numeric', () => {
    expect(matchCourseId(course(5))).toBe(5)
  })
  test('falls back to id when course_id absent', () => {
    expect(matchCourseId({ id: 7, course_uuid: 'course_7' })).toBe(7)
  })
  test('returns null when neither is numeric', () => {
    expect(matchCourseId({ course_uuid: 'course_x' })).toBeNull()
  })
})

describe('findRun', () => {
  test('returns the run matching the course id', () => {
    const t = trail([{ course_id: 1, steps: [] }, { course_id: 2, steps: [{ activity_id: 9, complete: false }] }])
    expect(findRun(t, 2)?.course_id).toBe(2)
  })
  test('returns null when no run matches', () => {
    expect(findRun(trail([{ course_id: 1, steps: [] }]), 99)).toBeNull()
  })
  test('returns null for null trail or null courseId', () => {
    expect(findRun(null, 1)).toBeNull()
    expect(findRun(trail([]), null)).toBeNull()
  })
})

describe('getCourseProgress', () => {
  test('empty trail yields not-started, 0%', () => {
    const p = getCourseProgress(null, course(1))
    expect(p.started).toBe(false)
    expect(p.percent).toBe(0)
    expect(p.completed).toBe(0)
    expect(p.total).toBe(0)
    expect(p.nextActivityId).toBeNull()
  })
  test('partial progress counts completed and finds next incomplete', () => {
    const t = trail([{ course_id: 1, steps: [
      { activity_id: 10, complete: true },
      { activity_id: 11, complete: false },
      { activity_id: 12, complete: false },
    ] }])
    const p = getCourseProgress(t, course(1))
    expect(p.started).toBe(true)
    expect(p.completed).toBe(1)
    expect(p.total).toBe(3)
    expect(p.percent).toBe(33)
    expect(p.nextActivityId).toBe(11)
  })
  test('all complete yields 100% and no next activity', () => {
    const t = trail([{ course_id: 1, steps: [
      { activity_id: 10, complete: true },
      { activity_id: 11, complete: true },
    ] }])
    const p = getCourseProgress(t, course(1))
    expect(p.percent).toBe(100)
    expect(p.nextActivityId).toBeNull()
  })
})

describe('getStartedCourseIds / getInProgressCourses / getNotStartedCourses', () => {
  const courses = [course(1), course(2), course(3)]
  const t = trail([
    { course_id: 1, steps: [{ activity_id: 10, complete: true }] },
    { course_id: 3, steps: [{ activity_id: 30, complete: false }] },
  ])
  test('started ids exclude runs with no steps', () => {
    expect(getStartedCourseIds(t)).toEqual([1, 3])
    expect(getStartedCourseIds(trail([{ course_id: 9, steps: [] }]))).toEqual([])
  })
  test('in-progress preserves catalog order', () => {
    expect(getInProgressCourses(t, courses).map((c) => c.course_id)).toEqual([1, 3])
  })
  test('not-started preserves catalog order and includes courses without numeric id', () => {
    const withGhost = [...courses, { course_uuid: 'course_x', name: 'Ghost' }]
    expect(getNotStartedCourses(t, withGhost).map((c) => c.course_id ?? 'x')).toEqual([2, 'x'])
  })
})

describe('getCompletedCourses', () => {
  test('only fully-complete courses count', () => {
    const courses = [course(1), course(2), course(3)]
    const t = trail([
      { course_id: 1, steps: [{ activity_id: 10, complete: true }, { activity_id: 11, complete: true }] },
      { course_id: 2, steps: [{ activity_id: 20, complete: true }, { activity_id: 21, complete: false }] },
    ])
    expect(getCompletedCourses(t, courses).map((c) => c.course_id)).toEqual([1])
  })
  test('a run with zero steps is not complete', () => {
    const t = trail([{ course_id: 1, steps: [] }])
    expect(getCompletedCourses(t, [course(1)])).toEqual([])
  })
})

describe('getOverallProgress', () => {
  test('aggregates across started runs', () => {
    const t = trail([
      { course_id: 1, steps: [{ activity_id: 10, complete: true }, { activity_id: 11, complete: true }] },
      { course_id: 2, steps: [{ activity_id: 20, complete: true }, { activity_id: 21, complete: false }] },
    ])
    const o = getOverallProgress(t)
    expect(o.started).toBe(2)
    expect(o.completed).toBe(3)
    expect(o.totalSteps).toBe(4)
    expect(o.percent).toBe(75)
  })
  test('empty trail yields zeros', () => {
    const o = getOverallProgress(null)
    expect(o).toEqual({ started: 0, completed: 0, totalSteps: 0, percent: 0 })
  })
})

describe('isFreePlan', () => {
  test('free / oss / empty are free; anything else is not', () => {
    expect(isFreePlan('free')).toBe(true)
    expect(isFreePlan('oss')).toBe(true)
    expect(isFreePlan('')).toBe(true)
    expect(isFreePlan(null)).toBe(true)
    expect(isFreePlan(undefined)).toBe(true)
    expect(isFreePlan('standard')).toBe(false)
    expect(isFreePlan('pro')).toBe(false)
    expect(isFreePlan('enterprise')).toBe(false)
  })
})

describe('getNextSteps', () => {
  test('returns up to `limit` in-progress courses with their progress', () => {
    const courses = [course(1), course(2), course(3), course(4)]
    const t = trail([
      { course_id: 1, steps: [{ activity_id: 10, complete: false }] },
      { course_id: 2, steps: [{ activity_id: 20, complete: true }] },
      { course_id: 3, steps: [{ activity_id: 30, complete: false }] },
      { course_id: 4, steps: [{ activity_id: 40, complete: false }] },
    ])
    const steps = getNextSteps(t, courses, 3)
    expect(steps).toHaveLength(3)
    expect(steps[0].course.course_id).toBe(1)
    expect(steps[0].progress.nextActivityId).toBe(10)
    expect(steps[1].course.course_id).toBe(2)
  })
  test('no in-progress courses yields empty list', () => {
    expect(getNextSteps(null, [course(1)])).toEqual([])
  })
})

describe('inferAcademy / groupByAcademy', () => {
  test('recognizes known academy tags (case-insensitive)', () => {
    expect(inferAcademy(course(1, { tags: ['ai'] }))).toBe('Inteligência Artificial')
    expect(inferAcademy(course(1, { tags: ['IA'] }))).toBe('Inteligência Artificial')
    expect(inferAcademy(course(1, { tags: ['business'] }))).toBe('Business')
    expect(inferAcademy(course(1, { tags: ['creators'] }))).toBe('Creators')
    expect(inferAcademy(course(1, { tags: ['genesis'] }))).toBe('Genesis')
  })
  test('falls back to Atlas Club when no academy tag', () => {
    expect(inferAcademy(course(1))).toBe('Atlas Club')
    expect(inferAcademy(course(1, { tags: ['random'] }))).toBe('Atlas Club')
  })
  test('groupByAcademy groups and preserves order within groups', () => {
    const courses = [
      course(1, { tags: ['ai'] }),
      course(2, { tags: ['business'] }),
      course(3, { tags: ['ai'] }),
      course(4, {}),
    ]
    const groups = groupByAcademy(courses)
    const names = groups.map((g) => g.academy)
    expect(names).toEqual(['Inteligência Artificial', 'Business', 'Atlas Club'])
    const ai = groups.find((g) => g.academy === 'Inteligência Artificial')
    expect(ai?.courses.map((c) => c.course_id)).toEqual([1, 3])
  })
})
