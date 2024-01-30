import { NextFunction, Request, Response } from 'express'
import { validate } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { IMiddleware } from '../middleware.interface'
import { createErrorResponse } from './helpers'

class ValidateBodyMiddleware implements IMiddleware {
  constructor(private readonly classToValidate: ClassConstructor<{}>) {}

  async execute({ body }: Request, res: Response, next: NextFunction) {
    const instance = plainToInstance(this.classToValidate, body)

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        const errorResponse = createErrorResponse(errors)

        res.status(400).json(errorResponse)
      } else {
        next()
      }
    })
  }
}

export { ValidateBodyMiddleware }
