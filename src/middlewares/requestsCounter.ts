import {Response, Request, NextFunction} from "express";
import {RequestForApiType} from "../utils/types";
import {requestForApiRepository} from "../repositories/requestForApi-mongoose-repository";


export const requestsCounter = async (req: Request, res: Response, next: NextFunction) => {
    const requestForIpi: RequestForApiType = {
        IP: req.ip,
        URL: req.baseUrl,
        date: new Date()
    }
    await requestForApiRepository.addRequest(requestForIpi)
    const totalCounter = await requestForApiRepository.findFilteredCounter(requestForIpi.IP, requestForIpi.URL, requestForIpi.date)
    console.log(totalCounter)
    next()
}

