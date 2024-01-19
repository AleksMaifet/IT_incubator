import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type sortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface IComments {
  id: string
  postId: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: Date
}

interface GetCommentsRequestQuery<T> {
  sortBy: string
  sortDirection: sortDirectionType
  pageNumber: T
  pageSize: T
}

interface ICommentsResponse {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: IComments[]
}

export { IComments, GetCommentsRequestQuery, ICommentsResponse }
