const MIN_COMMENT_LENGTH = 20
const MAX_COMMENT_LENGTH = 300

const DEFAULTS = {
  SORT_BY: 'createdAt',
  PAGE_NUMBER: 1,
  PAGE_SIZE: 10,
  SORT_DIRECTION: {
    ['asc']: 'asc',
    ['desc']: 'desc',
  } as const,
}

export { MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH, DEFAULTS }
