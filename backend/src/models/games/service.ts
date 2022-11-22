import { Schema } from "mongoose";

import GameModel from "./model";
import PlayerModel from "../players/model";
import IGame from "./interface";
import Props from "../../utils/props";

class GameService {
  private game = GameModel;
  private player = PlayerModel;

  public async createGame(
    HeartbeatRate: Array<Number>,
    BreathRate: Array<Number>,
    VascularPressureRateSystolic: Array<Number>,
    VascularPressureRateDiastolic: Array<Number>
  ): Promise<IGame | Error> {
    try {
      const game = await this.game.create({
        HeartbeatRate,
        BreathRate,
        VascularPressureRateSystolic,
        VascularPressureRateDiastolic
      });

      return game;
    } catch (error) {
      throw new Error("Unable to create game");
    }
  }

  public async pushRatesGame(
    _id: Schema.Types.ObjectId,
    HeartbeatRate: Array<Number>,
    BreathRate: Array<Number>,
    VascularPressureRateSystolic: Array<Number>,
    VascularPressureRateDiastolic: Array<Number>
  ): Promise<IGame | Error> {
    try {
      const game = await this.game.findByIdAndUpdate(
        { _id },
        {
          $push: {
            HeartbeatRate: HeartbeatRate,
            BreathRate: BreathRate,
            VascularPressureRateSystolic: VascularPressureRateSystolic,
            VascularPressureRateDiastolic: VascularPressureRateDiastolic
          },
        },
        { new: true }
      );

      if (!game) {
        throw new Error("Unable to update game with thad id");
      }

      return game;
    } catch (error) {
      throw new Error("Unable to update game");
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

  public async getGame(_id: Schema.Types.ObjectId): Promise<IGame | Array<IGame> | Error> {
    try {
      const game = await this.game.findById(_id);

      if (!game) {
        throw new Error("Unable to find game");
      }

      return game;
    } catch (error) {
      throw new Error("Unable to find game");
    }
  }

  public async deleteGame(_id: Schema.Types.ObjectId): Promise<IGame | Error> {
    try {
      const game = await this.game.findByIdAndDelete(_id);

      if (!game) {
        throw new Error("Unable to delete game with that id");
      }

      await this.player.updateMany({game: _id}, {$pull: {game: _id}});

      return game;
    } catch (error) {
      throw new Error("Unable to delete game");
    }
  }
}

export default GameService;