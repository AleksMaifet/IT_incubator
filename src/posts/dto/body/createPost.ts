import { BasePostDto } from './basePost'
import { IsString, Validate } from 'class-validator'
import { IsBlogExist } from '../../../middlewares/libs/customValidDecorators'

class CreatePostDto extends BasePostDto {
  @IsString()
  @Validate(IsBlogExist, {
    message: 'blog is not exists',
  })
  readonly blogId: string
}

export { CreatePostDto }
