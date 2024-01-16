const MIN_LENGTH = 1
const MAX_TITLE_LENGTH = 40
const MAX_AUTHOR_TITLE_LENGTH = 20

const AGE_RESTRICTION = {
  MIN: 1,
  MAX: 18,
}

const AVAILABLE_RESOLUTIONS = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
] as const

export {
  MIN_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  AVAILABLE_RESOLUTIONS,
  AGE_RESTRICTION,
}
