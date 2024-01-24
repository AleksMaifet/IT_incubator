import { model, Schema } from 'mongoose'

type TokenType = {
  refreshed: string
  expired: string
}

const BlackListToken = new Schema<TokenType>(
  {
    refreshed: {
      type: String,
      index: true,
    },
    expired: {
      type: String,
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

const BlackListTokenModel = model<TokenType>('BlackListToken', BlackListToken)

export { BlackListTokenModel }
