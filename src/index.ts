import {createApp} from "./app-config";
import cookieParser from "cookie-parser";
//
// const port = process.env.PORT || 5000
//
//
// const app = createApp()
// app.set('trust proxy', true)
//
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

import { app } from './app-settings'
import { runDb } from './repositories/db'
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const port = process.env.PORT || 3999
app.set('trust proxy', true)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()

module.exports = app