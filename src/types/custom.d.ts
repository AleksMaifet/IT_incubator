import { IUser } from '../users'

declare global {
  namespace Express {
    export interface Request {
      context: {
        user: Omit<IUser, 'passwordSalt' | 'passwordHash'>
      }
    }
  }
  type Nullable<T> = T | null
}
