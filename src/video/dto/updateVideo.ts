import {
  IsBoolean,
  IsInt,
  Matches,
  Max,
  Min,
  NotEquals,
  ValidateIf,
} from 'class-validator'
import { AGE_RESTRICTION } from '../constants'
import { CommonVideoDto } from './common'

class UpdateVideoDto extends CommonVideoDto {
  @IsBoolean()
  canBeDownloaded: boolean

  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(AGE_RESTRICTION.MIN)
  @Max(AGE_RESTRICTION.MAX)
  minAgeRestriction?: number

  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: 'publicationDate must be a valid date in YYYY-MM-DD format',
  })
  publicationDate: string
}

export { UpdateVideoDto }
