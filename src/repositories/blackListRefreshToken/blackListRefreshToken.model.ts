import { model, Schema } from 'mongoose'

type RefreshTokenType = { token: string }

const BlackListRefreshToken = new Schema<RefreshTokenType>(
  {
    token: {
      type: String,
      required: true,
      index: true,
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

const BlackListRefreshTokenModel = model<RefreshTokenType>(
  'BlackListRefreshToken',
  BlackListRefreshToken
)

export { BlackListRefreshTokenModel }
