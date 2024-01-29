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

  public getAll = async () => {
    return await this.videoModel.find().exec()
  }

  public getById = (id: number) => {
    return this.videoModel.findOne({ id }).exec()
  }

  public updateById = async (id: number, dto: UpdateVideoDto) => {
    return await this.videoModel.updateOne({ id }, dto).exec()
  }

  public create = async (dto: CreateVideoDto) => {
    return await this.videoModel.create(dto)
  }

  public deleteById = async (id: number) => {
    return await this.videoModel.deleteOne({ id }).exec()
  }
}

export { VideosRepository }
