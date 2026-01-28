import { IsString, IsOptional, IsBoolean, IsInt, IsArray } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsInt()
  @IsOptional()
  yearsExperience?: number;

  @IsBoolean()
  @IsOptional()
  isTeam?: boolean;

  @IsInt()
  @IsOptional()
  teamSize?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  vehicles?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tools?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  aptitudes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trades?: string[];
}
