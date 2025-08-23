import { BaseEntity } from "./common/base";
import { SubCategory } from "./common/response";
import { ClientUser } from "./user";

export interface ForumItem extends BaseEntity {
    title: string;
    slug: string;
}

export interface ForumTopic extends BaseEntity {
    author_id?: number;
    category_id?: number;
    title: string;
    slug: string;
    content: string;
    status?: boolean;
    views?: number;
}

export interface ForumTopicDetail extends BaseEntity {
    user: ClientUser;
    category: SubCategory;
    title: string;
    slug: string;
    content: string;
    views: number;
}

export interface ForumTopicUpper extends ForumTopic {
    user: ClientUser;
    category: SubCategory;
}

export interface ForumTopicsParams {
    page?: number;
    per_page?: number;
    category?: string;
    locale?: string;
}
