import { IUserRepository } from "@/domain/ports/IUserRepository";
import { TasteVector } from "@/domain/value-objects/TasteVector";
import { UserAnswersDTO } from "../dto/UserAnswersDTO";

export class OnboardingUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(dto: UserAnswersDTO): Promise<void> {
    const vector = TasteVector.fromAnswers(dto.answers);

    const existing = await this.userRepo.getById(dto.userId);

    const userData = {
      tasteProfile: {
        vector: vector.toArray(),
        answers: dto.answers.reduce(
          (acc, ans, i) => ({ ...acc, [`q${i + 1}`]: ans }),
          {} as Record<string, string>
        ),
      },
      lastActivity: new Date().toISOString(),
    };

    if (existing) {
      await this.userRepo.update(dto.userId, userData);
    } else {
      await this.userRepo.save({
        id: dto.userId,
        ...userData,
        followerCount: 0,
        followingCount: 0,
        outfitCount: 0,
        createdAt: new Date().toISOString(),
      });
    }
  }
}
