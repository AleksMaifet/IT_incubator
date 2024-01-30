import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { BaseController } from '../common'
import { TYPES } from '../types'
import {
  AuthBasicMiddlewareGuard,
  ValidateBodyMiddleware,
  ValidateParamsMiddleware,
} from '../middlewares'
import { UsersService } from './users.service'
import { CreateUserDto, UserExist } from './dto'
import { GetUsersRequestQuery } from './interfaces'

@injectable()
class UsersController extends BaseController {
  constructor(
    @inject(TYPES.AuthBasicMiddlewareGuard)
    private readonly authBasicMiddlewareGuard: AuthBasicMiddlewareGuard,
    @inject(TYPES.UsersService)
    private readonly usersService: UsersService
  ) {
    super()
    this.bindRoutes({
      path: '/',
      method: 'get',
      func: this.getAll,
      middlewares: [this.authBasicMiddlewareGuard],
    })
    this.bindRoutes({
      path: '/',
      method: 'post',
      func: this.create,
      middlewares: [
        this.authBasicMiddlewareGuard,
        new ValidateBodyMiddleware(CreateUserDto),
      ],
    })
    this.bindRoutes({
      path: '/:id',
      method: 'delete',
      func: this.deleteById,
      middlewares: [
        this.authBasicMiddlewareGuard,
        new ValidateParamsMiddleware(UserExist),
      ],
    })
  }

  private async getAll(
    req: Request<{}, {}, {}, GetUsersRequestQuery<string>>,
    res: Response
  ) {
    const { query } = req

    const result = await this.usersService.getAll(query)

    res.status(200).json(result)
  }

  private async create(req: Request<{}, {}, CreateUserDto>, res: Response) {
    const { body } = req

    const result = await this.usersService.create(body)

    res.status(201).json(result)
  }

  private async deleteById({ params }: Request<UserExist>, res: Response) {
    const { id } = params

    await this.usersService.deleteById(id)

    res.sendStatus(204)
  }
}

export { UsersController }
