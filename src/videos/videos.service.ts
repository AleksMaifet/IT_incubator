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

  public getAll = async () => {
    return await this.videosRepository.getAll()
  }

  public getById = (id: number) => {
    return this.videosRepository.getById(id)
  }

  public updateById = async (id: number, dto: UpdateVideoDto) => {
    return await this.videosRepository.updateById(id, dto)
  }

  public create = async ({
    title,
    author,
    availableResolutions,
  }: CreateVideoDto) => {
    const newVideo = new Video(title, author, false, null, availableResolutions)

    return await this.videosRepository.create(newVideo)
  }

  public deleteById = async (id: number) => {
    return await this.videosRepository.deleteById(id)
  }
}

export { VideosService }
