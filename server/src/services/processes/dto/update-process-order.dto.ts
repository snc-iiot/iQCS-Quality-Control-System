import { IsArray, ArrayMinSize /*, IsUUID*/ } from 'class-validator';
// import { Type } from 'class-transformer';

// export class ProcessOrder {
//   @IsUUID()
//   process_id: string;
// }

export class UpdateProcessOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  // @Type(() => ProcessOrder)
  processes: string[];
}
