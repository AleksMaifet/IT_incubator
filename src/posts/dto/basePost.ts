import { IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_SHORT_DESCRIPTION_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from '../constants'
import { IsBlogExist } from '../libs/customValidDecorators'

class BasePostDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_POST_TITLE_LENGTH)
  title: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_POST_SHORT_DESCRIPTION_LENGTH)
  shortDescription: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_POST_CONTENT_LENGTH)
  content: string

  @IsString()
  @IsBlogExist({
    message: 'Blog is not exists',
  })
  blogId: string
}

export { BasePostDto }
