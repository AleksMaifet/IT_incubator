import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type sortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface GetBlogsRequestQuery<T> {
  searchNameTerm?: string
  sortBy: string
  sortDirection: sortDirectionType
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

interface IBlogsResponse {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export { GetBlogsRequestQuery, sortDirectionType, IBlog, IBlogsResponse }
