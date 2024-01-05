interface IErrorMessage {
  message: string
  field: string
}

export interface IErrorResponse {
  errorsMessages: IErrorMessage[]
}
