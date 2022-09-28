import express from 'express'
import { getDb } from './db'

export const app = express()

app.use(express.json())

app.get(`/user`, async (_req, res) => {
  const result = await getDb().user.findMany()
  res.json(result)
})

app.post(`/user`, async (req, res) => {
  const { name, email } = req.body
  try {
    const result = await getDb().user.create({
      data: {
        name,
        email,
      },
    })
    res.json(result)
  } catch (e) {
    res.status(409).json({
      error: 'User already exists!',
    })
  }
})
