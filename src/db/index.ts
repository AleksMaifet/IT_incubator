import { IBlog, IPost, IVideo } from './interface'

class DB {
  private static singleton: DB
  public readonly videos = new Map<number, IVideo>()
  public readonly blogs = new Map<string, IBlog>()
  public readonly posts = new Map<string, IPost>()

  constructor() {
    if (DB.singleton) {
      return DB.singleton
    }
    DB.singleton = this
  }
}

export { DB }
