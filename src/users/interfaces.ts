import { sortDirectionType } from '../blogs/interfaces'

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
}

export { IUser, GetUsersRequestQuery, IUsersResponse }
