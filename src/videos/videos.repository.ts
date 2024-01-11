import { CreateVideoDto, UpdateVideoDto } from './dto'
import { VideoModel } from './video.model'

class VideosRepository {
  constructor(private readonly videoModel: typeof VideoModel) {}

  public getAll = async () => {
    return await this.videoModel.find().exec()
  }

  public getById = async (id: number) => {
    return await this.videoModel.findOne({ id }).exec()
  }

  public updateById = async (id: number, dto: UpdateVideoDto) => {
    return await this.videoModel.findOneAndUpdate({ id }, dto).exec()
  }

  public create = async (dto: CreateVideoDto) => {
    return await this.videoModel.create(dto)
  }

  public deleteById = async (id: number) => {
    return await this.videoModel.findOneAndDelete({ id }).exec()
  }
}

export { VideosRepository }
