import * as express from 'express'
import { json } from 'body-parser'
import * as logger from 'morgan'
import * as fs from 'fs-extra'
export const app = express()
import * as cors from 'cors'

app.use(json())
app.use(cors())
app.use(logger(process.env.NODE_ENV == 'dev' ? 'combined' : 'tiny'))

app.get('/list', async (req, res) => {
  let data = {}

  data = await fs
    .readJSON(
      `./tasks-${req.headers.authorization?.substring(
        6,
        req.headers.authorization?.length
      )}.json`
    )
    .catch(e => (data = JSON.stringify({ tasks: [] })))
  res.json(data)
})

app.put('/list', async (req, res) => {
  console.log(req.body)
  await fs.writeJSON(
    `./tasks-${req.headers.authorization?.substring(
      6,
      req.headers.authorization?.length
    )}.json`,
    req.body
  )
  res.json(req.body)
})

const port = process.env.PORT ?? 3000
app.listen(port, () => console.log(`Listening to port ${port}...`))
