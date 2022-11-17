import {createApp} from "./app-config";

const port = process.env.PORT || 5000

const app = createApp()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
