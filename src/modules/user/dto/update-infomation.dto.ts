import { IsNotEmpty, IsString } from "class-validator";

export class UpdateInfomationDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}