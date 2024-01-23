import { Validate } from 'class-validator'
import { IsUserExist } from '../../../middlewares/libs/customValidDecorators'

class UserExist {
  @Validate(IsUserExist, {
    message: 'user is not exists',
  })
  readonly id: string
}

export { UserExist }
