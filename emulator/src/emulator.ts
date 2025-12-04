import type { Optional } from "./optional.js";

import SpaceService, { type ServiceError } from "./service.js";
import Space from "./space.js";

import { randomUUID } from "crypto";

export type EmulatorOptions = {
  stateInterval?: number;
  amountOfSpace?: number;
};

export type EmulatorErrors =
  | { code: "NOT_ENOUGH_SPACE" }
  | { code: "UNHANDLED"; message: string; error: any };

class Emulator {
  private readonly options: Required<EmulatorOptions>;
  private readonly spaceService: SpaceService;
  private spaces: Space[] = [];
  private interval: NodeJS.Timeout | null = null;

  constructor(spaceService: SpaceService, options: EmulatorOptions) {
    this.options = {
      amountOfSpace: options.amountOfSpace || 10,
      stateInterval: options.stateInterval || 1000,
    };
    this.spaceService = spaceService;
  }

  public async checkSpaces(): Promise<Optional<EmulatorErrors, null>> {
    const result = await this.spaceService.getAllSpaces();

    if (result.right) {
      this.spaces = result.right;

      if (result.right.length < this.options.amountOfSpace) {
        return { left: { code: "NOT_ENOUGH_SPACE" } };
      }

      return { right: null };
    }

    if (result.left?.code === "SPACE_NOT_FOUND") {
      return { left: { code: "NOT_ENOUGH_SPACE" } };
    }

    return { right: null };
  }

  public start() {
    this.initialStep();
    this.interval = setInterval(() => {
      this.step();
    }, this.options.stateInterval);
  }

  private async createSpacesLeft() {
    const spaceLeft = this.options.amountOfSpace - this.spaces.length;
    console.debug(`Need to create ${spaceLeft} spaces`);

    console.debug("Creating spaces");
    const spaceCreationPromises = Array.from(
      { length: spaceLeft },
      async () => {
        const result = await this.spaceService.createSpace({
          id: randomUUID(),
          status: false,
        });
        if (result.left) {
          console.log("Failed to create space due to:", result.left);
        } else {
          console.log(`Space ${result.right.id} created`);
        }

        return result.right!;
      },
    );

    const createdSpaces = await Promise.all(spaceCreationPromises);
    console.debug(`Created ${createdSpaces.length} spaces`);
    this.spaces = [...this.spaces, ...createdSpaces];
  }

  private async initialStep() {
    try {
      console.debug("Checking if there are enough spaces created in database");
      const checkSpacesResult = await this.checkSpaces();

      if (
        checkSpacesResult.left &&
        checkSpacesResult.left.code === "NOT_ENOUGH_SPACE"
      ) {
        await this.createSpacesLeft();
      }
    } catch (error: any) {}
  }

  private step() {
    console.log("Avaliable spaces " + this.spaces.length);

    for (let i = 0; i < this.spaces.length; i++) {
      const newStatus = !this.spaces[i]!.status;

      console.debug(
        `Updating space ${this.spaces[i]!.id} from ${this.spaces[i]!.status} to ${newStatus}`,
      );

      this.spaceService
        .updateSpaceStatus({
          id: this.spaces[i]!.id,
          status: newStatus,
        })
        .then((result) => {
          if (result.left) {
            return console.log("Failed to update space due to:", result.left);
          }

          console.debug(`Space ${this.spaces[i]!.id} updated`);
          this.spaces[i]!.status = newStatus;
        })
        .catch((error) => {
          console.log("Failed to update space due to:", error);
        });
    }
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export default Emulator;
