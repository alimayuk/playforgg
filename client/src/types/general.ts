import { BlogWithUser } from "./blog";
import { FeaturedCategory } from "./category";
import { SubCategory } from "./common/response";
import { ForumItem } from "./forumTopic";
import { GameType } from "./game";

export interface HomePageData {
    blogs: BlogWithUser[];
    games: GameType[];
    categories: SubCategory[];
    featuredCategories: FeaturedCategory[];
    forums: ForumItem[];
    status: string;
}
