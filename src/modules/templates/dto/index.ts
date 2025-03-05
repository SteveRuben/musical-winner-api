export class CreateTemplateDto {
  name: string;
  data: string;
  creatorId: number;
}

export class UpdateTemplateDto {
  data: string;
  creatorId: number;
}
