import { IUser } from '../users'

declare global {
  namespace Express {
    export interface Request {
      context: {
        user: Omit<IUser, 'passwordSalt' | 'passwordHash'>
        token: {
          deviceId: string
          iat: number
          exp: number
        }
      }
    }
  }
  type Nullable<T> = T | null
}
