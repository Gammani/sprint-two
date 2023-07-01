import {RequestForApiType} from "../utils/types";
import {requestForApiCollection} from "./db";

export const requestForApiRepository = {
    async addRequest(dataRequest: RequestForApiType) {
        await requestForApiCollection.insertOne({...dataRequest})
        return
    },
    async findFilteredCounter(IP: string, URL: string, date: Date): Promise<number | null> {
        const newDate = new Date(date.getTime() - 10000);
        const foundCounters = await requestForApiCollection.find({IP: IP, URL: URL, date: { $gte: newDate}}).toArray()
        // const foundCounters = await requestForApiCollection.find({IP: IP, URL: URL}, {projection: {_id: 0}})
        return foundCounters.length
    },
    async deleteAll() {
        const result = await requestForApiCollection.deleteMany({})
        return
    }
}