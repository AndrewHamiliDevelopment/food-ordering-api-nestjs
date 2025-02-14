import { BaseEntity } from "src/Base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class UserDetail extends BaseEntity {
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn()
    @ApiProperty()
    user: User;
    @Column()
    @ApiProperty()
    lastName: string;
    @Column()
    firstName: string;
    @Column()
    middleName: string;

    constructor(userDetail: Partial<UserDetail>) {
        super();
        Object.assign(this, userDetail);
    }

}