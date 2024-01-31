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

  public async getAll() {
    return await this.videoModel.find().exec()
  }

  public async getById(id: number) {
    return await this.videoModel.findOne({ id }).exec()
  }

  public async updateById(id: number, dto: UpdateVideoDto) {
    return await this.videoModel.updateOne({ id }, dto).exec()
  }

  public async create(dto: CreateVideoDto) {
    return await this.videoModel.create(dto)
  }

  public async deleteById(id: number) {
    return await this.videoModel.deleteOne({ id }).exec()
  }
}

export { VideosRepository }
