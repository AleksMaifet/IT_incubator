import { model, Schema } from 'mongoose'
import { IPasswordRecoveryConfirmation } from '../interfaces'

const PasswordRecoveryConfirmationSchema =
  new Schema<IPasswordRecoveryConfirmation>(
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

const PasswordRecoveryConfirmationModel = model<IPasswordRecoveryConfirmation>(
  'PasswordRecoveryConfirmation',
  PasswordRecoveryConfirmationSchema
)

export { PasswordRecoveryConfirmationModel }
