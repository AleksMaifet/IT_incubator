import { IVideo } from './interface'

class DB {
  private static singleton: DB
  public readonly db = new Map<number, IVideo>()

  constructor() {
    if (DB.singleton) {
      return DB.singleton
    }
    DB.singleton = this
  }
}

export { DB }
