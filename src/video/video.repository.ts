import { DB } from '../db'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { Video } from './video.entity'

class VideoRepository {
  constructor(private readonly videosDB: DB) {}

  public getAll = () => {
    return [...this.videosDB.db.values()]
  }

  public getById = (id: number) => {
    return this.videosDB.db.get(id)
  }

  public updateById = (id: number, body: UpdateVideoDto) => {
    const currentVideo = this.videosDB.db.get(id)

    if (!currentVideo) {
      return false
    }

    this.videosDB.db.set(id, { ...currentVideo, ...body })
    return true
  }

  public create = ({ title, author, availableResolutions }: CreateVideoDto) => {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    this.videosDB.db.set(newVideo.id, newVideo)
    return newVideo
  }

  public deleteAll = () => {
    return this.videosDB.db.clear()
  }

  public deleteById = (id: number) => {
    return this.videosDB.db.delete(id)
  }
}

export { VideoRepository }
