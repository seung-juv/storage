import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ type: Number, default: 0 })
  page: number;

  @ApiProperty({ type: Number, required: false, default: 10 })
  limit?: number;

  @ApiProperty({ type: Number, required: false, default: 0 })
  offset?: number;
}

export class PageInfo {
  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  totalResults: number;

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({ type: Number })
  offset: number;

  @ApiProperty({ type: Number })
  resultsPerPage: number;

  @ApiProperty({ type: Boolean })
  hasNext: boolean;

  @ApiProperty({ type: Boolean })
  hasPrev: boolean;
}

export class PaginatedDto<TData> {
  @ApiProperty({ type: () => PageInfo })
  pageInfo: PageInfo;

  @ApiProperty({ type: Array })
  results: TData[];
}
