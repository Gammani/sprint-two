import {Router, Request, Response} from "express";
import IP from 'ip'
import {lookup} from "geoip-lite";
import * as os from "os";
import {networkInterfaces} from "os";

export const addressRouter = Router({})

addressRouter.get('/', async (req: Request, res: Response) => {
    //const ipAdr = os.networkInterfaces()
    //  const ipAdr = req.ip

    //  const ipAdr = req.ip
    // //const ipAdr = req.connection.address()
    // // const ipAddresses = req.header('x-forwarded-for') || req.socket.remoteAddress
    // //  console.log(ipAddresses)
    // const ipAddress = IP.address();
    // // res.send(ipAddress)
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    // console.log(lookup(ipAddress))
    // res.send(lookup(ipAddress))
    // let interfaces = os.networkInterfaces()

res.send('helo')

})