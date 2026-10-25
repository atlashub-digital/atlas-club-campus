/*
 * Atlas ClubOS — pure progress helpers (Wave 2)
 * --------------------------------------------------
 * Derived from the real LearnHouse trail shape:
 *   trail = { runs: Array<{ course_id: number; steps: Array<{ activity_id: number; complete: boolean }> }> }
 *
 * These functions are PURE (no React, no hooks) so they can be unit-tested
 * with `bun test` and reused by the dashboard without duplicating logic.
 *
 * Courses from useCourses expose a numeric id as either `course_id` or `id`
 * (the trail uses the numeric course id). `matchCourseId` normalizes this.
 */

export interface AtlasTrailStep {
  activity_id: number
  complete: boolean
}
export interface AtlasTrailRun {
  course_id: number
  steps: AtlasTrailStep[]
}
export interface AtlasTrail {
  runs?: AtlasTrailRun[]
}

export interface AtlasCourseLike {
  course_uuid?: string
  course_id?: number
  id?: number
  name?: string
  description?: string
  thumbnail_image?: string
  tags?: string[]
  [key: string]: unknown
}

export interface AtlasCourseProgress {
  courseId: number | null
  started: boolean
  completed: number
  total: number
  percent: number        // 0..100 (integer)
  nextActivityId: number | null
}

/** Normalize the numeric course id from a course-like object. */
export function matchCourseId(course: AtlasCourseLike): number | null {
  const a = (course as any).course_id
  const b = (course as any).id
  const n = typeof a === 'number' ? a : typeof b === 'number' ? b : null
  return n
}

/** Find the trail run for a course id (or null). */
export function findRun(trail: AtlasTrail | null | undefined, courseId: number | null): AtlasTrailRun | null {
  if (!trail || !Array.isArray(trail.runs) || courseId == null) return null
  return trail.runs.find((r) => r && r.course_id === courseId) ?? null
}

/** Compute progress for a single course against the trail. */
export function getCourseProgress(
  trail: AtlasTrail | null | undefined,
  course: AtlasCourseLike
): AtlasCourseProgress {
  const courseId = matchCourseId(course)
  const run = findRun(trail, courseId)
  const steps = run?.steps ?? []
  const total = steps.length
  const completed = steps.filter((s) => s && s.complete === true).length
  const started = total > 0
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const nextStep = steps.find((s) => s && s.complete === false) ?? null
  return {
    courseId,
    started,
    completed,
    total,
    percent,
    nextActivityId: nextStep ? nextStep.activity_id : null,
  }
}

/** Course ids the user has started (has at least one step recorded). */
export function getStartedCourseIds(trail: AtlasTrail | null | undefined): number[] {
  if (!trail || !Array.isArray(trail.runs)) return []
  return trail.runs.filter((r) => r && Array.isArray(r.steps) && r.steps.length > 0).map((r) => r.course_id)
}

/** Courses the user has started (in-progress), preserving catalog order. */
export function getInProgressCourses(
  trail: AtlasTrail | null | undefined,
  courses: AtlasCourseLike[]
): AtlasCourseLike[] {
  const started = new Set(getStartedCourseIds(trail))
  return courses.filter((c) => started.has(matchCourseId(c) ?? -1))
}

/** Courses the user has NOT started yet (no trail run), preserving catalog order. */
export function getNotStartedCourses(
  trail: AtlasTrail | null | undefined,
  courses: AtlasCourseLike[]
): AtlasCourseLike[] {
  const started = new Set(getStartedCourseIds(trail))
  return courses.filter((c) => {
    const id = matchCourseId(c)
    return id == null ? true : !started.has(id)
  })
}

/** Courses that are 100% complete (started with all steps complete, total > 0). */
export function getCompletedCourses(
  trail: AtlasTrail | null | undefined,
  courses: AtlasCourseLike[]
): AtlasCourseLike[] {
  return courses.filter((c) => {
    const p = getCourseProgress(trail, c)
    return p.started && p.completed === p.total && p.total > 0
  })
}

/** Overall aggregate progress across all started courses (0..100). */
export function getOverallProgress(trail: AtlasTrail | null | undefined): {
  started: number
  completed: number
  totalSteps: number
  percent: number
} {
  if (!trail || !Array.isArray(trail.runs)) {
    return { started: 0, completed: 0, totalSteps: 0, percent: 0 }
  }
  const runs = trail.runs.filter((r) => r && Array.isArray(r.steps) && r.steps.length > 0)
  const totalSteps = runs.reduce((acc, r) => acc + r.steps.length, 0)
  const completed = runs.reduce(
    (acc, r) => acc + r.steps.filter((s) => s && s.complete === true).length,
    0
  )
  const started = runs.length
  const percent = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0
  return { started, completed, totalSteps, percent }
}

/** Is the current plan a free / limited tier (no paid entitlement)? */
export function isFreePlan(plan: string | null | undefined): boolean {
  if (!plan) return true
  const p = String(plan).toLowerCase()
  return p === 'free' || p === 'oss' || p === ''
}

/** Build the "next steps" list: in-progress courses, each with its next activity. */
export interface AtlasNextStep {
  course: AtlasCourseLike
  progress: AtlasCourseProgress
}
export function getNextSteps(
  trail: AtlasTrail | null | undefined,
  courses: AtlasCourseLike[],
  limit = 3
): AtlasNextStep[] {
  const inProgress = getInProgressCourses(trail, courses)
  return inProgress
    .slice(0, limit)
    .map((course) => ({ course, progress: getCourseProgress(trail, course) }))
}

/**
 * Infer a logical "academy" label from a course's tags (Atlas ADR-002: academies
 * are logical divisions). Falls back to "Atlas Club" when no academy tag exists.
 * Recognized academy tags (case-insensitive): ai, business, creators, genesis.
 */
export function inferAcademy(course: AtlasCourseLike): string {
  const tags = (course.tags ?? []).map((t) => String(t).toLowerCase())
  if (tags.includes('ai') || tags.includes('ia') || tags.includes('inteligencia-artificial')) return 'Inteligência Artificial'
  if (tags.includes('business') || tags.includes('negocios')) return 'Business'
  if (tags.includes('creators') || tags.includes('criadores')) return 'Creators'
  if (tags.includes('genesis')) return 'Genesis'
  return 'Atlas Club'
}

/** Group courses by inferred academy. */
export function groupByAcademy(courses: AtlasCourseLike[]): { academy: string; courses: AtlasCourseLike[] }[] {
  const map = new Map<string, AtlasCourseLike[]>()
  for (const c of courses) {
    const a = inferAcademy(c)
    const arr = map.get(a) ?? []
    arr.push(c)
    map.set(a, arr)
  }
  return Array.from(map.entries()).map(([academy, cs]) => ({ academy, courses: cs }))
}
