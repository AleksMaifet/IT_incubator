import { IsNotEmpty, IsString } from 'class-validator'

class RegConfirmAuthDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string
}

export { RegConfirmAuthDto }
