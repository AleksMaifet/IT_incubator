import { SORT_DIRECTION_ENUM } from '../comments'

const MIN_LENGTH = 1
const MAX_BLOG_NAME_LENGTH = 15
const MAX_BLOG_DESCRIPTION_LENGTH = 500
const MAX_BLOG_WEBSITE_URL_LENGTH = 100

const DEFAULTS = {
  SEARCH_NAME_TERM: 'null',
  SORT_BY: 'createdAt',
  PAGE_NUMBER: 1,
  PAGE_SIZE: 10,
  SORT_DIRECTION: SORT_DIRECTION_ENUM,
}

export {
  MIN_LENGTH,
  MAX_BLOG_NAME_LENGTH,
  MAX_BLOG_DESCRIPTION_LENGTH,
  MAX_BLOG_WEBSITE_URL_LENGTH,
  DEFAULTS,
}
