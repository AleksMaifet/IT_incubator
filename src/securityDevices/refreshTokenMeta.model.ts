import { model, Schema } from 'mongoose'
import { IRefreshTokenMeta } from './interface'

const RefreshTokenMeta = new Schema<IRefreshTokenMeta>(
  {
    issuedAt: {
      type: String,
      required: true,
      index: true,
    },
    expirationAt: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    clientIp: {
      type: String,
      required: true,
      index: true,
    },
    deviceName: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
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

const RefreshTokenMetaModel = model<IRefreshTokenMeta>(
  'RefreshTokenMeta',
  RefreshTokenMeta
)

export { RefreshTokenMetaModel }
