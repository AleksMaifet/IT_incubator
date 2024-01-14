import { BasePostDto } from './basePost'
import { IsString, Validate } from 'class-validator'
import { IsBlogExist } from '@src/middlewares/libs/customValidDecorators'

class CreatePostDto extends BasePostDto {
  @IsString()
  @Validate(IsBlogExist, {
    message: 'Blog is not exists',
  })
  readonly blogId: string
}

export { CreatePostDto }