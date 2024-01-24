import { Container } from 'inversify'
import { useContainer } from 'class-validator'
import { App } from './app'
import { TYPES } from './types'
import { appBindings } from './common'

const bootstrap = () => {
  const appContainer = new Container({ autoBindInjectable: true })
  useContainer(appContainer, { fallbackOnErrors: true })
  appContainer.load(appBindings)

  const app = appContainer.get<App>(TYPES.Application)
  app.init()

  return { app }
}

export const boot = bootstrap()
