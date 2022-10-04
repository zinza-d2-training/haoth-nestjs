import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from 'src/typeorm/entities/site.entity';
import { Repository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { ISite } from './interfaces/site.interface';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
  ) {}

  async findAll(): Promise<ISite[]> {
    try {
      return await this.siteRepository.find({
        relations: ['ward', 'ward.district', 'ward.district.province'],
      });
    } catch (error) {
      throw new HttpException('Not exits Site', 404);
    }
  }

  async findOne(id: number): Promise<ISite> {
    try {
      const site = await this.siteRepository.findOne({
        where: { id },
        relations: ['ward', 'ward.district', 'ward.district.province'],
      });
      return site;
    } catch (error) {
      throw new HttpException('Not exits Site', 404);
    }
  }

  async create(createSiteDto: CreateSiteDto): Promise<ISite> {
    try {
      const newSite = await this.siteRepository.save(createSiteDto);
      return newSite;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async update(id: number, updateSiteDto: UpdateSiteDto): Promise<ISite> {
    try {
      await this.siteRepository.update({ id }, updateSiteDto);
      const siteUpdate = await this.findOne(id);
      return siteUpdate;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      await this.siteRepository.delete({ id });
      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
