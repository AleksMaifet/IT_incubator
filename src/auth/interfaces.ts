interface IEmailConfirmation {
  userId: string
  code: string
  expiresIn: Date
  isConfirmed: boolean
}

export { IEmailConfirmation }
