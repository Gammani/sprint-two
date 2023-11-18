import {RequestForApiType} from "../utils/types";
import {RequestForApiModel} from "../mongo/requestForApi/requestForApi.model";

export class RequestForApiRepository {
    async addRequest(dataRequest: RequestForApiType) {
        const requestInstance = new RequestForApiModel({})

        requestInstance.IP = dataRequest.IP
        requestInstance.URL = dataRequest.URL
        requestInstance.date = dataRequest.date
        const result = await requestInstance.save()

        return
    }
    async findFilteredCounter(IP: string, URL: string, date: Date): Promise<number | null> {
        const newDate = new Date(date.getTime() - 10000);
        const foundCounters = await RequestForApiModel.find({IP: IP, URL: URL, date: { $gte: newDate}})
        // const foundCounters = await requestForApiCollection.find({IP: IP, URL: URL}, {projection: {_id: 0}})
        return foundCounters.length
    }
    async deleteAll() {
        const result = await RequestForApiModel.deleteMany({})
        return
    }
}