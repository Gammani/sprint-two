import {NextFunction, Request, Response} from "express";
import {RequestForApiType} from "../utils/types";
import {HTTP_STATUSES} from "../utils/utils";
import {RequestForApiRepository} from "../repositories/requestForApi-mongoose-repository";

const requestForApiRepository = new RequestForApiRepository()

export const restrictionRequests = async (req: Request, res: Response, next: NextFunction) => {
    const requestForIpi: RequestForApiType = {
        IP: req.ip,
        URL: req.originalUrl,
        date: new Date()
    }
    await requestForApiRepository.addRequest(requestForIpi)
    const totalCounter = await requestForApiRepository.findFilteredCounter(requestForIpi.IP, requestForIpi.URL, requestForIpi.date)
    if(totalCounter && totalCounter > 5) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    } else {
        next()
    }
}