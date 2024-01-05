import { ArrayMinSize, IsArray, IsIn, IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  AVAILABLE_RESOLUTIONS,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
} from '../constants'
import { AvailableResolutionsType } from '../../db/interface'

class CommonVideoDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_TITLE_LENGTH)
  title: string

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, MAX_AUTHOR_TITLE_LENGTH)
  author: string

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(AVAILABLE_RESOLUTIONS, { each: true })
  availableResolutions: AvailableResolutionsType
}

export { CommonVideoDto }
