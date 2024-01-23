import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator'
import { IsUserExist } from '../../../middlewares/libs/customValidDecorators'

class RegEmailResendingAuthDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'email must be a valid',
  })
  @Validate(IsUserExist, {
    message: 'email is not exists',
  })
  readonly email: string
}

export { RegEmailResendingAuthDto }
