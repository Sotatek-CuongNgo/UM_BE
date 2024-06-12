import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { PaginationDtoConstant } from "src/app/constants/pagination-dto.constant";

export class SearchUserDto extends PaginationDtoConstant {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;
}