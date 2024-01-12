import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CreateVideoDto, UpdateVideoDto } from './dto/body'
import { VideoModel } from './video.model'
import { TYPES } from '../types'

@injectable()
class VideosRepository {
  constructor(
    @inject(TYPES.VideoModel) private readonly videoModel: typeof VideoModel
  ) {}

  public getAll = async () => {
    return await this.videoModel.find().exec()
  }

  public getById = async (id: number) => {
    return await this.videoModel.findOne({ id }).exec()
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
