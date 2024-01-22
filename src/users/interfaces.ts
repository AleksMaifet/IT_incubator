import { DEFAULTS } from './constants'

const { SORT_DIRECTION } = DEFAULTS

type sortDirectionType = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]

interface IUser {
  id: string
  login: string
  email: string
  passwordSalt: string
  passwordHash: string
  createdAt: Date
}

interface GetUsersRequestQuery<T> {
  sortBy: string
  sortDirection: sortDirectionType
  pageNumber: T
  pageSize: T
  searchLoginTerm: string
  searchEmailTerm: string
}

interface IUsersResponse {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Pick<IUser, 'id' | 'login' | 'email' | 'createdAt'>[]
}

export { IUser, GetUsersRequestQuery, IUsersResponse }
