import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Response,
} from '@loopback/rest';
import {Album} from '../models';
import {AlbumRepository} from '../repositories';
import {inject} from '@loopback/core';

export class AlbumController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository: AlbumRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}

  @post('/albums')
  @response(200, {
    description: 'Album model instance',
    content: {'application/json': {schema: getModelSchemaRef(Album)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {
            title: 'NewAlbum',
            exclude: ['id'],
          }),
        },
      },
    })
    album: Omit<Album, 'id'>,
  ): Promise<Album> {
    return this.albumRepository.create(album);
  }

  @get('/albums/count')
  @response(200, {
    description: 'Album model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Album) where?: Where<Album>): Promise<Count> {
    return this.albumRepository.count(where);
  }

  @get('/albums')
  @response(200, {
    description: 'Array of Album model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Album, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Album) filter?: Filter<Album>): Promise<Album[]> {
    const Data = this.albumRepository.find(filter);

    this.response.set('Access-Control-Expose-Headers', 'X-Total-Count');
    this.response.set('x-total-count', (await Data).length.toString());

    return Data;

    return this.albumRepository.find(filter);
  }

  @patch('/albums')
  @response(200, {
    description: 'Album PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
    @param.where(Album) where?: Where<Album>,
  ): Promise<Count> {
    return this.albumRepository.updateAll(album, where);
  }

  @get('/albums/{id}')
  @response(200, {
    description: 'Album model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Album, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Album, {exclude: 'where'})
    filter?: FilterExcludingWhere<Album>,
  ): Promise<Album> {
    return this.albumRepository.findById(id, filter);
  }

  @patch('/albums/{id}')
  @response(204, {
    description: 'Album PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
  ): Promise<void> {
    await this.albumRepository.updateById(id, album);
  }

  @put('/albums/{id}')
  @response(204, {
    description: 'Album PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() album: Album,
  ): Promise<void> {
    await this.albumRepository.replaceById(id, album);
  }

  @del('/albums/{id}')
  @response(204, {
    description: 'Album DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.albumRepository.deleteById(id);
  }
}
