import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { BlogModel, BlogsRepository } from '../../../blogs'

@ValidatorConstraint({ async: true })
class IsBlogExistConstraint implements ValidatorConstraintInterface {
  async validate(blogId: string) {
    const blog = await new BlogsRepository(BlogModel).getById(blogId)

    return !!blog
  }
}

function IsBlogExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExistConstraint,
    })
  }
}

export { IsBlogExist }
