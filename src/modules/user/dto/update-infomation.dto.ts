import { IsOptional, IsString } from "class-validator";

export class UpdateInfomationDto {
  @IsString()
  @IsOptional()
  username: string;
}