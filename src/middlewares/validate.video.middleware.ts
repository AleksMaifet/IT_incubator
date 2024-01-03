import { NextFunction, Request, Response } from 'express'
import { validate } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { IMiddleware } from './interface'
import { ErrorResponse } from '../errors'

class ValidateVideoMiddleware implements IMiddleware {
  constructor(private readonly classToValidate: ClassConstructor<object>) {}

  execute = async ({ body }: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(this.classToValidate, body)

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        const errorMessages: ErrorResponse[] = errors.map(
          ({ constraints, property }) => ({
            errorsMessages: [
              {
                message: Object.values(constraints || {}).join(', '),
                field: property,
              },
            ],
          })
        )

        res.status(400).json(...errorMessages)
      } else {
        next()
      }
    })
  }
}

export { ValidateVideoMiddleware }
