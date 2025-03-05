export class CreateExperienceRatingDto {
  rating: number;
  feedback?: string;
  roomId?: number;
  spaceId?: number;
}

export class UpdateExperienceRatingDto {
  rating?: number;
  feedback?: string;
}
