import { ValidationError } from 'class-validator'
import { IErrorResponse } from './interface'

const createErrorResponse = (errors: ValidationError[]) => {
  const errorResponse: IErrorResponse = {
    errorsMessages: [],
  }

  errors.forEach(({ constraints, property }) => {
    errorResponse.errorsMessages.push({
      message: Object.values(constraints || {}).join(', '),
      field: property,
    })
  })

  return errorResponse
}

export { createErrorResponse }
