import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  MIN_LOGIN_LENGTH,
  MAX_LOGIN_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../../constants'

class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'login must be a valid',
  })
  readonly login: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  readonly password: string

  @IsNotEmpty()
  @IsString()

  // TODO fixed pattern, check tests result
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'email must be a valid',
  })
  readonly email: string
}

export { CreateUserDto }
