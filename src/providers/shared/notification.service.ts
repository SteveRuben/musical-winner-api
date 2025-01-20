import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async notifyExperienceRating(rating: any, accountId: number, isUpdate: boolean) {
    // Implémentez la logique de notification
  }

  async notifySurveyResponse(response: any, accountId: number) {
    // Implémentez la logique de notification
  }
}