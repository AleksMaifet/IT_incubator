import { NextFunction, Request, Response } from 'express'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { IMiddleware } from '../middleware.interface'
import { createErrorResponse } from './helpers'

class ValidateParamsMiddleware implements IMiddleware {
  constructor(private readonly classToValidate: ClassConstructor<{}>) {}

  async execute({ params }: Request, res: Response, next: NextFunction) {
    const instance = plainToInstance(this.classToValidate, params)

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        const errorResponse = createErrorResponse(errors)

        res.status(404).json(errorResponse)
      } else {
        next()
      }
    })
  }
}

export { ValidateParamsMiddleware }
