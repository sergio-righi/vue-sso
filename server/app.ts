import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import compression from 'compression'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'

import { env } from './utils'
import { AuthRoute, MailRoute, TokenRoute } from './routes'

class App {
  public express: any

  constructor() {
    this.express = express()

    this.setDatabase().then(() => {
      this.setConfiguration()
      this.setRoutes()

      this.getMemoryUsage()
    })
  }

  getMemoryUsage() {
    const used = process.memoryUsage()
    for (let key in used) {
      console.log(
        `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
      )
    }
  }

  async setDatabase() {
    await mongoose.connect(env.get('mongoose'))
    const databaseConnection = mongoose.connection
    databaseConnection.on(
      'error',
      console.error.bind(console, 'MongoDB Connection error')
    )
  }

  setConfiguration() {
    this.express.use(cookieParser())
    this.express.use(express.json({ limit: '10mb' }))
    this.express.use(
      cors({
        credentials: true,
        origin: env.get('cors'),
      })
    )
    this.express.use(
      session({
        secret: env.get('session.express'),
        resave: false,
        rolling: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: env.get('mongoose') }),
      })
    )
    this.express.use(compression())
    this.express.use(passport.session())
    this.express.use(express.urlencoded({ extended: true }))
  }

  setRoutes() {
    this.express.use('/auth', AuthRoute)
    this.express.use('/mail', MailRoute)
    this.express.use('/token', TokenRoute)
  }
}

export default new App().express
