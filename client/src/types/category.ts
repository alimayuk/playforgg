import { BaseEntity } from "./common/base";

export interface Category extends BaseEntity {
    parent_id?: number;
    title: string;
    slug: string;
    status: boolean;
    image?: string;
    icon?: string;
    featured?: boolean,
    locale: string;
}

export interface FeaturedCategory extends Category {
    icon: string;
    image: string;
}
