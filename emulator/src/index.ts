import SpaceService from "./service.js";
import Emulator from "./emulator.js";

const spaceService = new SpaceService("http://127.0.0.1:3000/api/spaces");
const emulator = new Emulator(spaceService, {
  amountOfSpace: 20,
  stateInterval: 5000,
});

emulator.start();
