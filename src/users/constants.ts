const MIN_LOGIN_LENGTH = 3
const MAX_LOGIN_LENGTH = 10

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20

const DEFAULTS = {
  SEARCH_LOGIN_TERM: 'null',
  SEARCH_EMAIL_TERM: 'null',
  SORT_BY: 'createdAt',
  PAGE_NUMBER: 1,
  PAGE_SIZE: 10,
  SORT_DIRECTION: {
    ['asc']: 'asc',
    ['desc']: 'desc',
  } as const,
}

export {
  MIN_LOGIN_LENGTH,
  MAX_LOGIN_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  DEFAULTS,
}
