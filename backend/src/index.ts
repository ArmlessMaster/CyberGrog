import "dotenv/config";
import "module-alias/register";

import App from "./app";
import PlayerController from "./models/players/controller";
import GameController from "./models/games/controller";
import envValidation from "./utils/validateEnv";

envValidation();

const app = new App(
  [new PlayerController(), new GameController()],
  Number(process.env.PORT)
);

app.listen();