import { IsString, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  MAX_LOGIN_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_LOGIN_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../constants'
import { BaseUserDto } from './baseUser'

class CreateUserDto extends BaseUserDto {
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
}

export { CreateUserDto }
