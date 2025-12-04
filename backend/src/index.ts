import "dotenv/config";

import server from "./server.js";

server.listen({ port: 3000, host: "0.0.0.0" }, (_, address) => {
  console.log(`Server listening at ${address}`);
});
