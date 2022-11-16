import IPlayer from "../models/players/interface";

declare global {
  namespace Express {
    export interface Request {
      player: IPlayer;
    }
  }
}