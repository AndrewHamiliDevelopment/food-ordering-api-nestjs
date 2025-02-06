import { BaseEntity } from "src/Base.entity";
import { Entity } from "typeorm";

@Entity()
export class User extends BaseEntity{
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    photoURL: string;
    disabled: boolean;

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

}