import { BaseEntity } from "./common/base";

export interface Article extends BaseEntity {
    author_id?: number;
    title: string;
    slug: string;
    excerpt?: string;
    status: string;
    image: string;
    views?: number;
    locale: string;
}
