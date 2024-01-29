import { IsNotEmpty, IsString, Length, Validate } from 'class-validator'
import { IsPasswordRecoveryConfirmationValid } from '../../../middlewares'
import { Transform } from 'class-transformer'
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../../users/constants'

class UpdatePassDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  readonly newPassword: string

  @IsNotEmpty()
  @IsString()
  @Validate(IsPasswordRecoveryConfirmationValid, {
    message: 'invalid recoveryCode',
  })
  readonly recoveryCode: string
}

export { UpdatePassDto }
