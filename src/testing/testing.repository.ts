import { DB } from '../db'

class TestingRepository {
  constructor(private readonly DB: DB) {}

  public deleteAll = () => {
    this.DB.videos.clear()
    this.DB.blogs.clear()
    this.DB.posts.clear()
  }
}

export { TestingRepository }
