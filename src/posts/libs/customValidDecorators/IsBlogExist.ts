import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { BlogsRepository } from '../../../blogs'
import { DB } from '../../../db'

@ValidatorConstraint({ async: false })
class IsBlogExistConstraint implements ValidatorConstraintInterface {
  validate(blogId: string) {
    const blog = new BlogsRepository(new DB()).getById(blogId)

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
