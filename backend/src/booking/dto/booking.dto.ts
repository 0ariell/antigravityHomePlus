import { IsString, IsOptional, IsDateString, IsArray, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  serviceId: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsDateString()
  @IsOptional()
  preferredDate?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

export class UpdateBookingStatusDto {
  @IsString()
  status: 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  quotedPrice?: number;
}
