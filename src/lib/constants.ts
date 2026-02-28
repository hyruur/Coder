/**
 * Shared application-wide constants.
 */

/** Deduplicated list of selectable tech stacks. */
export const TECH_STACKS: readonly string[] = [
  'React', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Python', 'Java', 'Go', 'PHP',
  'TypeScript', 'JavaScript',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', '阿里云',
  '微信小程序', 'iOS', 'Android', 'Flutter',
  'HTML/CSS', 'Bootstrap', 'Tailwind CSS',
  'Express.js', 'Django', 'Spring Boot', 'Laravel',
]

export const PRIORITIES = [
  { value: 'LOW',    label: '低优先级' },
  { value: 'MEDIUM', label: '中优先级' },
  { value: 'HIGH',   label: '高优先级' },
  { value: 'URGENT', label: '紧急' },
] as const

export const ORDER_STATUSES = [
  { value: 'PUBLISHED',   label: '已发布' },
  { value: 'BIDDING',     label: '招标中' },
  { value: 'IN_PROGRESS', label: '进行中' },
] as const
