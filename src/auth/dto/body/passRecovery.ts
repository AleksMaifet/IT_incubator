import { IsNotEmpty, IsString, Matches } from 'class-validator'

class PassRecoveryDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'email must be a valid',
  })
  readonly email: string
}

export { PassRecoveryDto }
