import { model, Schema } from 'mongoose'
import { IUser } from './interfaces'

const UserSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    login: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (_, ret) {
        delete ret.__v
        delete ret._id
      },
    },
  }
)

const UserModel = model<IUser>('User', UserSchema)

export { UserModel }
