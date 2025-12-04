import type { Space } from "../model/Space.js";
import type { SpaceRepository } from "../repository/SpaceRepository.js";
import type { Optional } from "../types/optional.js";
import type { CreateSpaceBody } from "../types/bodyType.js";

export type SpaceServiceErrors =
  | "space-not-found"
  | "space-already-exists"
  | "invalid-space-data"
  | "database-error"

export class SpaceService {
  constructor(
    private readonly spaceRepository: SpaceRepository
  ) {}

  public async getSpaceById(spaceId: string): Promise<Optional<Space, SpaceServiceErrors>> {
    const space = await this.spaceRepository.findById(spaceId)
    if(space) {
      return { left: space }
    }
    return { right: "space-not-found" }
  }
  
  public async updateSpaceStatus(spaceId: string, status: boolean): Promise<Optional<Space, SpaceServiceErrors>> {
    
    let space = await this.spaceRepository.findById(spaceId)
    
    if (!space) {
      return { right: "space-not-found" }
    }
    
    const updatedSpace = await this.spaceRepository.updateKey(spaceId, 'status', status)
    
    if('right' in updatedSpace) {
      return updatedSpace
    }

    return { left: updatedSpace.left }
  }
  
  public async deleteSpaceById(spaceId: string): Promise<Optional<Space, SpaceServiceErrors>> {
    
    const space = await this.spaceRepository.findById(spaceId)
    
    if (!space) {
      return { right: "space-not-found" }
    }
    
    await this.spaceRepository.delete(spaceId)
    
    return { left: space }
  }

  public async createSpace(data: CreateSpaceBody): Promise<Optional<Space, SpaceServiceErrors>> {
    const newSpace = await this.spaceRepository.create(data)
    return newSpace
  }

  public async getAll() {
    const spaces = await this.spaceRepository.listAll()

    if("right" in spaces) {
      return {right: spaces.right}
    }
    return spaces
  }
}