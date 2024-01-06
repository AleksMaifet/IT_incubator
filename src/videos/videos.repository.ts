import { DB } from '../db'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { Video } from './video.entity'

class VideosRepository {
  constructor(private readonly DB: DB) {}

  public getAll = () => {
    return [...this.DB.videos.values()]
  }

  public getById = (id: number) => {
    return this.DB.videos.get(id)
  }

  public updateById = (id: number, body: UpdateVideoDto) => {
    const currentVideo = this.DB.videos.get(id)

    if (!currentVideo) {
      return false
    }

    this.DB.videos.set(id, { ...currentVideo, ...body })
    return true
  }

  public create = ({ title, author, availableResolutions }: CreateVideoDto) => {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    this.DB.videos.set(newVideo.id, newVideo)
    return newVideo
  }

  public deleteById = (id: number) => {
    return this.DB.videos.delete(id)
  }
}

export { VideosRepository }
