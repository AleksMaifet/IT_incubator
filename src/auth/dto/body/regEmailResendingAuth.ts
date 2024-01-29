import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator'
import { IsRegEmailResendingValid } from '../../../middlewares'

class RegEmailResendingAuthDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'email must be a valid',
  })
  @Validate(IsRegEmailResendingValid, {
    message: 'email already confirmed or user email doesnt exist',
  })
  readonly email: string
}

export { RegEmailResendingAuthDto }
