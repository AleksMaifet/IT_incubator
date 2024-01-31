import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type SortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface GetPostsRequestQuery<T> {
  sortBy: string
  sortDirection: SortDirectionType
  pageNumber: T
  pageSize: T
}

interface IPost {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: Date
}

interface IPostsResponse {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: IPost[]
}

export { GetPostsRequestQuery, IPost, IPostsResponse }
