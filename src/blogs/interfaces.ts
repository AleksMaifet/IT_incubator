import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type SortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface GetBlogsRequestQuery<T> {
  searchNameTerm?: string
  sortBy: string
  sortDirection: SortDirectionType
  pageNumber: T
  pageSize: T
}

interface IBlog {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: Date
  isMembership: boolean
}

interface IBlogsResponse<T> {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}

export { GetBlogsRequestQuery, IBlog, IBlogsResponse }
