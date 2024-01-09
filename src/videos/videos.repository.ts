import { CreateVideoDto, UpdateVideoDto } from './dto'
import { Video } from './video.entity'
import { VideoModel } from './video.model'

class VideosRepository {
  constructor(private readonly videoModel: typeof VideoModel) {}

  public getAll = async () => {
    return await this.videoModel.find().exec()
  }

  public getById = async (id: number) => {
    return await this.videoModel.findOne({ id }).exec()
  }

  public updateById = async (id: number, body: UpdateVideoDto) => {
    return await this.videoModel.findOneAndUpdate({ id }, body).exec()
  }

  public create = async ({
    title,
    author,
    availableResolutions,
  }: CreateVideoDto) => {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    return await this.videoModel.create(newVideo)
  }

  public deleteById = async (id: number) => {
    return await this.videoModel.findOneAndDelete({ id }).exec()
  }
}

export { VideosRepository }
