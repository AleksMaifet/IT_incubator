import { model, Schema } from 'mongoose'
import { IEmailConfirmation } from '../interfaces'

const EmailConfirmationSchema = new Schema<IEmailConfirmation>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      index: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
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

const EmailConfirmationModel = model<IEmailConfirmation>(
  'EmailConfirmation',
  EmailConfirmationSchema
)

export { EmailConfirmationModel }
