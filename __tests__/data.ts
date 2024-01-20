import { CreateUserDto } from '../src/users'
import { CreatePostDto } from '../src/posts'
import { BaseBlogDto } from '../src/blogs/dto/body'
import { CreateVideoDto } from '../src/videos'
import { BaseCommentDto } from '../src/comments'

interface IDefaultTestData {
  USER_DATA: CreateUserDto
  POST_DATA: CreatePostDto
  BLOG_DATA: BaseBlogDto
  VIDEO_DATA: CreateVideoDto
  COMMENT_DATA: BaseCommentDto
}

const DEFAULT_TEST_DATA: IDefaultTestData = {
  USER_DATA: {
    login: '37ukNrWNgG',
    password: 'string',
    email:
      '_mrkPmUcMJP2tlbPWUk6BCrgMnOi4mDQoaAU26biSxkYwNFnvlm2OfQvoUEt4axNefIaUmSiRgyC@3gTGCstAJzDfaqSuVgo4TAv4' +
      'ysYRp.SnIrhf7Cc1Pz4PofoT2get_zNk3tNwWbM_jFKUcY.ygD',
  },
  POST_DATA: {
    title: 'string',
    content: 'string',
    shortDescription: 'string',
    blogId: 'string',
  },
  BLOG_DATA: {
    name: 'string',
    description: 'string',
    websiteUrl: 'https://google.com',
  },
  VIDEO_DATA: {
    title: 'string',
    author: 'string',
    availableResolutions: ['P144'],
  },
  COMMENT_DATA: {
    content: 'stringstringstringst',
  },
}

export { DEFAULT_TEST_DATA }
