import { PaginationMeta } from "./pagination";
import { OtherBlog, Category, OtherGame, BlogType, GameType, ForumTopic, ForumTopicUpper } from "../index";
import { ClientUser } from "../user";

export type SubCategory = Pick<Category, 'id' | 'title' | 'slug'>;


export interface ApiResponse<T> {
    data: T;
    status: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    status: string;
    meta: PaginationMeta;
}

export type OtherBlogWithCategory = OtherBlog & {
    category: SubCategory;
};

export interface BlogDetailResponse {
    data: BlogType;
    otherBlogs: OtherBlogWithCategory[];
};

export interface BlogListResponse {
    data: BlogType[];
    categories: SubCategory[];
    status: string;
    meta: PaginationMeta;
}

export type OtherGameWithCategory = OtherGame & {
    category: SubCategory;
};

export interface GameDetailResponse {
    data: GameType;
    otherGames: OtherGameWithCategory[];
};

export type GameListResponse = {
    data: GameType[];
    categories: SubCategory[];
    status: string;
    meta: PaginationMeta;
};

export interface ForumListResponse {
    data: ForumTopicUpper[];
    user: ClientUser;
    category: SubCategory;
    status: string;
    meta: PaginationMeta;
}

export type ForumTopicsResponse = {
    data: ForumTopic[];
    meta: PaginationMeta;
    status: string;
    categories: SubCategory[];
};