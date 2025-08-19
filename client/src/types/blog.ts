import { BaseEntity } from "./common/base";

export interface Blog extends BaseEntity {
    author_id?: number;
    category_id: number;
    title: string;
    slug: string;
    image: string;
    content: string;
    status: boolean;
    views: number;
    comment_count: number;
    excerpt: string;
    locale: string;
}

export interface OtherBlog extends BaseEntity {
    title: string;
    slug: string;
    image: string;
}
