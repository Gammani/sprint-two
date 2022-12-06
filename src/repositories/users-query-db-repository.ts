import {UserWithPaginationViewModel} from "../models/UserViewModel";
import {usersCollection} from "./db";
import {getUsersViewModel} from "../utils/utils";

export const usersQueryDbRepository = {
    async findUsers(
        searchLoginTermQuery: string | undefined,
        searchEmailTermQuery: string | undefined,
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<UserWithPaginationViewModel> {

        const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : ""
        const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : ""
        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        let filter: any = {}
        // if(searchLoginTerm || searchEmailTerm) {
        //     // filter.name = {$regex: {$or: [searchLoginTerm, searchEmailTerm]}, $options: "i"}
        //     filter = {$or: [{login: {$regex: searchLoginTerm, "$options": "i" }}, {email: {$regex: searchEmailTerm, "$options": "i" }}]}
        // }


         filter = {$and: [{login: {$regex: searchLoginTerm, "$options": "i" }}, {email: {$regex: searchEmailTerm, "$options": "i" }}]}
        //filter.login = {$regex: searchLoginTerm, $options: "i"}
        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await usersCollection
            .find(filter, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await usersCollection.find(filter).count({})
        const pageCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(getUsersViewModel)
        }
    }
}