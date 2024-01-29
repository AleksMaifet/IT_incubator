import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { GetUsersRequestQuery, IUser, IUsersResponse } from './interfaces'
import { UserModel } from './user.model'

@injectable()
class UsersRepository {
  constructor(
    @inject(TYPES.UserModel)
    private readonly userModel: typeof UserModel
  ) {}

  private _mapGenerateUserResponse = (user: IUser) => {
    const { id, login, email, createdAt } = user

    return {
      id,
      login,
      email,
      createdAt,
    }
  }

  private _getAllBySearchLoginOrEmailTerm = async (
    dto: GetUsersRequestQuery<number>
  ) => {
    const { searchEmailTerm, searchLoginTerm, ...rest } = dto

    const regexEmailTerm = new RegExp(searchEmailTerm!, 'i')
    const regexLoginTerm = new RegExp(searchLoginTerm!, 'i')

    const totalCount = await this.userModel
      .find({
        $or: [
          { login: { $regex: regexLoginTerm } },
          { email: { $regex: regexEmailTerm } },
        ],
      })
      .countDocuments()

    const { response, findOptions } = this._createdFindOptionsAndResponse({
      ...rest,
      totalCount,
    })

    const users = await this.userModel
      .find(
        {
          $or: [
            { login: { $regex: regexLoginTerm } },
            { email: { $regex: regexEmailTerm } },
          ],
        },
        null,
        findOptions
      )
      .exec()

    response.items = users.map(this._mapGenerateUserResponse)

    return response
  }

  private _getAllWithoutSearchLoginOrEmailTerm = async (
    dto: Omit<
      GetUsersRequestQuery<number>,
      'searchLoginTerm' | 'searchEmailTerm'
    >
  ) => {
    const totalCount = await this.userModel.countDocuments()

    const { response, findOptions } = this._createdFindOptionsAndResponse({
      ...dto,
      totalCount,
    })

    const users = await this.userModel.find({}, null, findOptions).exec()

    response.items = users.map(this._mapGenerateUserResponse)

    return response
  }

  private _getAllWithoutSearchLoginTerm = async (
    dto: Omit<GetUsersRequestQuery<number>, 'searchLoginTerm'>
  ) => {
    const { searchEmailTerm, ...rest } = dto

    const regexEmailTerm = new RegExp(searchEmailTerm!, 'i')

    const totalCount = await this.userModel
      .find({ email: { $regex: regexEmailTerm } })
      .countDocuments()

    const { response, findOptions } = this._createdFindOptionsAndResponse({
      ...rest,
      totalCount,
    })

    const users = await this.userModel
      .find({ email: { $regex: regexEmailTerm } }, null, findOptions)
      .exec()

    response.items = users.map(this._mapGenerateUserResponse)

    return response
  }

  private _getAllWithoutSearchEmailTerm = async (
    dto: Omit<GetUsersRequestQuery<number>, 'searchEmailTerm'>
  ) => {
    const { searchLoginTerm, ...rest } = dto

    const regexLoginTerm = new RegExp(searchLoginTerm!, 'i')

    const totalCount = await this.userModel
      .find({ login: { $regex: regexLoginTerm } })
      .countDocuments()

    const { response, findOptions } = this._createdFindOptionsAndResponse({
      ...rest,
      totalCount,
    })

    const users = await this.userModel
      .find({ login: { $regex: regexLoginTerm } }, null, findOptions)
      .exec()

    response.items = users.map(this._mapGenerateUserResponse)

    return response
  }

  private _createdFindOptionsAndResponse = (
    dto: Omit<
      GetUsersRequestQuery<number> & {
        totalCount: number
      },
      'searchLoginTerm' | 'searchEmailTerm'
    >
  ) => {
    const { totalCount, sortBy, sortDirection, pageNumber, pageSize } = dto

    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (pageNumber - 1) * pageSize

    const findOptions = {
      limit: pageSize,
      skip: skip,
      sort: { [sortBy]: sortDirection },
    }

    const response: IUsersResponse = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: [],
    }

    return { response, findOptions }
  }

  public getAll = async (dto: GetUsersRequestQuery<number>) => {
    const { searchEmailTerm, searchLoginTerm, ...rest } = dto

    switch (true) {
      case searchLoginTerm === 'null' && searchEmailTerm === 'null':
        return await this._getAllWithoutSearchLoginOrEmailTerm(rest)
      case searchLoginTerm === 'null':
        return await this._getAllWithoutSearchLoginTerm({
          searchEmailTerm,
          ...rest,
        })
      case searchEmailTerm === 'null':
        return await this._getAllWithoutSearchEmailTerm({
          searchLoginTerm,
          ...rest,
        })
      default:
        return await this._getAllBySearchLoginOrEmailTerm(dto)
    }
  }

  public getById = async (id: string) => {
    const user = await this.userModel
      .findOne({
        id,
      })
      .exec()

    if (!user) {
      return null
    }

    return this._mapGenerateUserResponse(user)
  }

  public create = async (dto: IUser) => {
    const user = await this.userModel.create(dto)

    return this._mapGenerateUserResponse(user)
  }

  public updatePassword = async (
    dto: Pick<IUser, 'id' | 'passwordSalt' | 'passwordHash'>
  ) => {
    const { id, passwordHash, passwordSalt } = dto

    return await this.userModel
      .updateOne({ id }, { passwordSalt, passwordHash })
      .exec()
  }

  public getByLoginOrEmail = async (loginOrEmail: string) => {
    return await this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .exec()
  }

  public deleteById = async (id: string) => {
    return await this.userModel.deleteOne({ id }).exec()
  }
}

export { UsersRepository }
