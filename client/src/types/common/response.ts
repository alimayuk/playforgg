import { PaginationMeta } from "./pagination";
import { Blog, OtherBlog, Category } from "../index";

type SubCategory = Pick<Category, 'title' | 'slug'>;

export type BlogType = Omit<Blog, 'category_id' | 'slug' | 'status' | 'locale' | 'excerpt' | 'comment_count' | 'views'> & {
    category: SubCategory;
};

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
}