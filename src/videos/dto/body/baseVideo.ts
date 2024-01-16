import { ArrayMinSize, IsArray, IsIn, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  AVAILABLE_RESOLUTIONS,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_LENGTH,
} from '../../constants'
import { AvailableResolutionsType } from '../../video.model'

class BaseVideoDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(MIN_LENGTH, MAX_TITLE_LENGTH)
  readonly title: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(MIN_LENGTH, MAX_AUTHOR_TITLE_LENGTH)
  readonly author: string

  @IsArray()
  @ArrayMinSize(MIN_LENGTH)
  @IsIn(AVAILABLE_RESOLUTIONS, { each: true })
  readonly availableResolutions: AvailableResolutionsType
}

export { BaseVideoDto }
