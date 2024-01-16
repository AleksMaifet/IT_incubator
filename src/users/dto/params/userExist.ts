import { Validate } from 'class-validator'
import { IsUserExist } from '../../../middlewares/libs/customValidDecorators'

class UserExist {
  @Validate(IsUserExist, {
    message: 'User is not exists',
  })
  readonly id: string
}

export { UserExist }
