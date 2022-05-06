import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { to500 } from '@polycode/to';
import { Module, ModuleDocument } from '../models/module.model';

@Injectable()
export class ModuleProviderService {
  constructor(
    @InjectModel(Module.name)
    private moduleModel: Model<ModuleDocument>
  ) {}

  /**
   * It returns a promise that resolves to a module, or rejects with a NotFoundException if no module
   * is found
   * @param conditions - Record<string, unknown>
   * @returns A single module
   */
  async getOne(
    conditions: Record<string, unknown>,
    populate = true
  ): Promise<ModuleDocument> {
    const query = this.moduleModel.findOne({ ...conditions });

    if (populate) {
      query.populate('exercises');
      query.populate('course');
    }

    const module = await to500<ModuleDocument>(query.exec());
    if (!module) {
      throw new NotFoundException();
    }

    return module;
  }

  /**
   * It returns a promise that resolves to an array of modules
   * @returns An array of modules
   */
  async getAll(populate = true): Promise<ModuleDocument[]> {
    const query = this.moduleModel.find();

    if (populate) {
      query.populate('exercises');
      query.populate('course');
    }

    const modules = await to500<ModuleDocument[]>(query.exec());
    return modules;
  }

  /**
   * It returns a promise that resolves to a module
   * @param {string} id - string - the id of the module we want to get
   * @returns A module
   */
  async getById(id: string): Promise<ModuleDocument> {
    const module = await this.getOne({ id });
    return module;
  }
}
