import { IsString, IsIn, MinLength, MaxLength } from 'class-validator'

import { REGIONS } from '../../../consts'

export class PlayerParamsValidation {
  @MinLength(2)
  @MaxLength(50)
  @IsString()
    public name: string

  @IsString()
  @IsIn(REGIONS)
  public   region: string
}