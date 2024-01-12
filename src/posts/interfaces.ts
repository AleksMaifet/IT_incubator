import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type sortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface GetPostsRequestQuery<T> {
  sortBy: string
  sortDirection: sortDirectionType
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

export { GetPostsRequestQuery, sortDirectionType, IPost, IPostsResponse }
