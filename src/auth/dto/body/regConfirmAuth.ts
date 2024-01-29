import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsRegConfirmationValid } from '../../../middlewares'

class RegConfirmAuthDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsRegConfirmationValid, {
    message: 'invalid code',
  })
  readonly code: string
}

export { RegConfirmAuthDto }
