import { BaseEntity } from "./common/base";
import { ClientUser } from "./user";

export interface Reply extends BaseEntity {
    user: ClientUser;
    text: string;
}

export interface Comment extends BaseEntity {
    user: ClientUser;
    text: string;
    replies: Reply[];
}

export interface CommentType extends BaseEntity {
    user: ClientUser;
    author_id: number;
    text: string;
    parent_id: number | null;
    replies?: Reply[];
}
