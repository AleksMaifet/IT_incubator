import { ArrayMinSize, IsArray, IsIn, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'
import { AvailableResolutionsType } from '@src/videos'
import {
  AVAILABLE_RESOLUTIONS,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
} from '@src/videos/constants'

class BaseVideoDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_TITLE_LENGTH)
  readonly title: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_AUTHOR_TITLE_LENGTH)
  readonly author: string

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(AVAILABLE_RESOLUTIONS, { each: true })
  readonly availableResolutions: AvailableResolutionsType
}

export { BaseVideoDto }
