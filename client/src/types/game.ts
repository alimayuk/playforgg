import { BaseEntity } from "./common/base";
import { SubCategory } from "./common/response";
import { ClientUser } from "./user";

export type GameType = Omit<Game, 'category_id' | 'status' | 'locale' | 'views'> & {
    category: SubCategory;
    slug?: string;
    excerpt?: string;
    user?: ClientUser;
};

export interface Game extends BaseEntity {
    author_id?: number;
    category_id: number;
    title: string;
    slug: string;
    image: string;
    content: string;
    status: boolean;
    views: number;
    excerpt?: string;
    locale: string;
}

export interface OtherGame extends BaseEntity {
    title: string;
    slug: string;
    image: string;
}
