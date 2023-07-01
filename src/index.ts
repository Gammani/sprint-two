import {createApp} from "./app-config";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000


const app = createApp()
app.set('trust proxy', true)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
