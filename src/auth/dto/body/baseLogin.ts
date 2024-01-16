import { IsNotEmpty, IsString } from 'class-validator'

class BaseLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly loginOrEmail: string

  @IsNotEmpty()
  @IsString()
  readonly password: string
}

export { BaseLoginDto }
