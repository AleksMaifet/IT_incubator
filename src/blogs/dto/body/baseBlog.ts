import { IsString, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  MAX_BLOG_DESCRIPTION_LENGTH,
  MAX_BLOG_NAME_LENGTH,
  MAX_BLOG_WEBSITE_URL_LENGTH,
} from '@src/blogs/constants'

class BaseBlogDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_BLOG_NAME_LENGTH)
  readonly name: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_BLOG_DESCRIPTION_LENGTH)
  readonly description: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_BLOG_WEBSITE_URL_LENGTH)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: 'websiteUrl must be a valid URL',
    }
  )
  readonly websiteUrl: string
}

export { BaseBlogDto }