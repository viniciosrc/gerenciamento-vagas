import type { Space } from "../model/Space.js";
import { knex } from "../provider/DatabaseKnexProvider.js";
import type { Optional } from "../types/optional.js";
import type { SpaceServiceErrors } from "../services/SpaceService.js";

export interface SpaceRepository {
  create(space: {id: string; status: boolean} ): Promise<Optional<Space, SpaceServiceErrors>>
  findById(id: string): Promise<Space | null>
  updateKey<T extends keyof Space>(id: string, key: T, value: Space[T]): Promise<Optional<Space, SpaceServiceErrors>>
  delete(id: string): Promise<void>
  listAll(): Promise<Optional<Space[], SpaceServiceErrors>>
}

export class SpaceRepo implements SpaceRepository {

  async create(space: {id: string; status: boolean}): Promise<Optional<Space, SpaceServiceErrors>> {
    try {
      const [ newSpace ] = await knex<Space>('spaces').insert(space).returning('*')

      if(!newSpace) {
        return { right: "invalid-space-data" }
      }

      return { left: newSpace }
    } catch(err) {
      console.error(err)
      return { right: "space-already-exists" }
    }
  }

  async findById(id: string): Promise<Space | null> {
      return await knex('spaces').where('id', id).first()
  }

  async updateKey<T extends keyof Space>(id: string, key: T, value: Space[T]): Promise<Optional<Space, SpaceServiceErrors>> {
      const [ spaceUpdated ] = await knex('spaces').where('id', id).update({ [key]: value }).returning('*')
      if (!spaceUpdated) {
        return {right: "space-not-found"}
      }
      return { left: spaceUpdated }
  }

  async delete(id: string): Promise<void> {
      await knex('spaces').where('id', id).del()
  }

  async listAll(): Promise<Optional<Space[], SpaceServiceErrors>>  {
    try {
      const spaces = await knex('spaces').select('*').returning('*')
      
      if (!spaces.length) {
        return { right: "space-not-found" }
      }
      return { left: spaces }
    } catch(err) {
      console.error(err)
      return { right: "database-error" }
    }
    
  }
}
