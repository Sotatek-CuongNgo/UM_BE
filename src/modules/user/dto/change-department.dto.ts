import { IsNotEmpty, IsNumber } from "class-validator";

export class ChangeDepartmentDto {
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;
}