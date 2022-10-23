import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})








app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})