import { PaginateConfig } from "nestjs-paginate";
import { User } from "./users/entities/user.entity";

export const userPaginateConfig: PaginateConfig<User> = {
    defaultLimit: 10,
    defaultSortBy: [['dateEntry', 'DESC']],
    sortableColumns: ['dateEntry']
}