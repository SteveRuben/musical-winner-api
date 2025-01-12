import { ExperienceLevel, ExpertiseArea } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTalentApplicationDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(ExperienceLevel)
  experience: ExperienceLevel;

  @IsEnum(ExpertiseArea)
  expertise: ExpertiseArea;

  @IsString()
  skills: string; // Sera parsé en JSON

  @IsString()
  @IsNotEmpty()
  bio: string;
}
