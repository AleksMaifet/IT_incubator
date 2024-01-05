import { IVideo } from './interface'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { Video } from './video.entity'

class VideoRepository {
  private stash = new Map<number, IVideo>()

  public getAll = () => {
    return [...this.stash.values()]
  }

  public getById = (id: number) => {
    return this.stash.get(id)
  }

  public updateById = (id: number, body: UpdateVideoDto) => {
    const currentVideo = this.stash.get(id)

    if (!currentVideo) {
      return false
    }

    this.stash.set(id, { ...currentVideo, ...body })
    return true
  }

  public create = ({ title, author, availableResolutions }: CreateVideoDto) => {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    this.stash.set(newVideo.id, newVideo)
    return newVideo
  }

  public deleteAll = () => {
    return this.stash.clear()
  }

  public deleteById = (id: number) => {
    return this.stash.delete(id)
  }
}

export { VideoRepository }
