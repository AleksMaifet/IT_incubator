import { model, Schema } from 'mongoose'

type TokenType = {
  token: string
}

const BlackListToken = new Schema<TokenType>(
  {
    token: {
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
