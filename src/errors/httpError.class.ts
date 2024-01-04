class HttpError extends Error {
  public statusCode: number
  public context?: string

  constructor(statusCode: number, message: string, context?: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.context = context
  }
}

export { HttpError }
