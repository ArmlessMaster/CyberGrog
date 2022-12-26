import { Schema } from "mongoose";

import GameModel from "./model";
import PlayerModel from "../players/model";
import IGame from "./interface";
import Props from "../../utils/props";

class GameService {
  private game = GameModel;
  private player = PlayerModel;

  public async createGame(
    _id: Schema.Types.ObjectId,
    HeartbeatRate: Array<Number>,
    BreathRate: Array<Number>,
    VascularPressureRateSystolic: Array<Number>,
    VascularPressureRateDiastolic: Array<Number>,
    gameId: Number
  ): Promise<IGame | Error> {
    try {
      const game1 = await this.game.findOne({ gameId: gameId });
      let game = {} as IGame;
      if (game1 === null) {
        game = await this.game.create({
          HeartbeatRate,
          BreathRate,
          VascularPressureRateSystolic,
          VascularPressureRateDiastolic,
          gameId,
        });
        await this.player.findByIdAndUpdate(
          { _id },
          {
            $push: {
              game: gameId,
            },
          },
          { new: true }
        );
      } else {
        game = (await this.game.findOneAndUpdate(
          { gameId },
          {
            $push: {
              HeartbeatRate: HeartbeatRate,
              BreathRate: BreathRate,
              VascularPressureRateSystolic: VascularPressureRateSystolic,
              VascularPressureRateDiastolic: VascularPressureRateDiastolic,
            },
          },
          { new: true }
        )) as IGame;

        if (!game) {
          throw new Error("Unable to update game with thad id");
        }
      }

      return game;
    } catch (error) {
      throw new Error("Unable to create game");
    }
  }

  public async getGames(props: Props): Promise<IGame | Array<IGame> | Error> {
    try {
      const game = await this.game
        .find({}, null, {
          sort: { createdAt: -1 },
        })
        .limit(props.limit);

      if (!game) {
        throw new Error("Unable to find games");
      }

      return game;
    } catch (error) {
      throw new Error("Unable to find games");
    }
  }

  public async getGame(gameId: Number): Promise<IGame | Array<IGame> | Error> {
    try {
      const game = await this.game.findOne({ gameId: gameId });

      if (!game) {
        throw new Error("Unable to find game");
      }

      return game;
    } catch (error) {
      throw new Error("Unable to find game");
    }
  }

  public async deleteGame(
    _id: Schema.Types.ObjectId,
    gameId: Number
  ): Promise<IGame | Error> {
    try {
      const game = await this.game.findByIdAndDelete(_id);
      const player = await this.player.find({});

      if (!game) {
        throw new Error("Unable to delete game with that id");
      }
      Promise.all(
        player.map(async (item) => {
          await this.player.updateOne(
            { _id: item._id },
            { $pull: { game: gameId } }
          );
        })
      );

      return game;
    } catch (error) {
      throw new Error("Unable to delete game");
    }
  }
}

export default GameService;