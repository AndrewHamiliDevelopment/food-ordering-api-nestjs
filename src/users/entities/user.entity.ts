import { BaseEntity } from "src/Base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserDetail } from "./user-detail.entity";

@Entity()
export class User extends BaseEntity {

    @Column()
    uid: string;
    @Column()
    displayName: string;
    @Column()
    email: string;
    @Column()
    emailVerified: boolean;
    @Column()
    phoneNumber: string;
    @Column()
    photoURL: string;
    @Column()
    disabled: boolean;

    @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
    userDetail: UserDetail;

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

}