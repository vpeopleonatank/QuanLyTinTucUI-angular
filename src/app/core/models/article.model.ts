import { Profile } from "./profile.model";

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  topicId: number;
  // favorited: boolean;
  // favoritesCount: number;
  author?: Profile;
}
