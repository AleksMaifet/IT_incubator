import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { VideoModel } from './video.model'

@injectable()
class VideosRepository {
  constructor(
    @inject(TYPES.VideoModel) private readonly videoModel: typeof VideoModel
  ) {}

  public getAll() {
    return this.videoModel.find().exec()
  }

  public getById(id: number) {
    return this.videoModel.findOne({ id }).exec()
  }

  public updateById(id: number, dto: UpdateVideoDto) {
    return this.videoModel.updateOne({ id }, dto).exec()
  }

  public create(dto: CreateVideoDto) {
    return this.videoModel.create(dto)
  }

  public deleteById(id: number) {
    return this.videoModel.deleteOne({ id }).exec()
  }
}

export { VideosRepository }
