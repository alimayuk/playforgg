import { BaseEntity } from "./common/base";

export interface UserSummary extends BaseEntity {
    username: string;
}

export interface Reply extends BaseEntity {
    user: UserSummary;
    text: string;
}

export interface Comment extends BaseEntity {
    user: UserSummary;
    text: string;
    replies: Reply[];
}
