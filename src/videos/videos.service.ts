import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../types'
import { VideosRepository } from './videos.repository'
import { CreateVideoDto, UpdateVideoDto } from './dto'
import { Video } from './video.entity'

@injectable()
class VideosService {
  constructor(
    @inject(TYPES.VideosRepository)
    private readonly videosRepository: VideosRepository
  ) {}

  public async getAll() {
    return await this.videosRepository.getAll()
  }

  public async getById(id: number) {
    return await this.videosRepository.getById(id)
  }

  public async updateById(id: number, dto: UpdateVideoDto) {
    return await this.videosRepository.updateById(id, dto)
  }

  public async create({ title, author, availableResolutions }: CreateVideoDto) {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    return await this.videosRepository.create(newVideo)
  }

  public async deleteById(id: number) {
    return await this.videosRepository.deleteById(id)
  }
}

export { VideosService }
