import { Schema } from "mongoose";

import PlayerModel from "./model";
import token from "../../utils/token";
import IPlayer from "./interface";

class PlayerService {
  private player = PlayerModel;

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const player = await this.player.findOne({ email });
      if (!player) {
        throw new Error(
          "Unable to find player account with that email address"
        );
      }

      if (await player.isValidPassword(password)) {
        const accesToken = token.createToken(player);
        return accesToken;
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error) {
      throw new Error("Unable to login player account");
    }
  }

  public async register(
    email: string,
    password: string
  ): Promise<string | Error> {
    try {
      const playerExists = await this.player.findOne({ email });

      if (playerExists) {
        throw new Error("Player account already exists");
      }

      const player = await this.player.create({
        email,
        password,
      });

      const accesToken = token.createToken(player);

      return accesToken;
    } catch (error) {
      throw new Error("Unable to create player account");
    }
  }

  public async updatePassword(
    _id: Schema.Types.ObjectId,
    new_password: string,
    password: string
  ): Promise<IPlayer | Error> {
    try {
      const account = await this.player.findOne({ _id });

      if (!account) {
        throw new Error("Unable to find account with that id");
      }

      if (await account.isValidPassword(password)) {
        const player = await this.player
          .findByIdAndUpdate(_id, { password: new_password }, { new: true })
          .populate({
            path: "game",
            populate: { path: "_id" },
          })
          .select("-password");

        if (!player) {
          throw new Error("Unable to update player account with that id");
        }

        return player;
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error) {
      throw new Error("The old password does not match the entered one");
    }
  }

  public async subscription(
    _id: Schema.Types.ObjectId,
    dayOfSubscribe: number
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findByIdAndUpdate(
          _id,
          {
            isSubscribe: true,
            subscribeTime: new Date().setDate(
              new Date().getDate() + dayOfSubscribe
            ),
          },
          { new: true }
        )
        .populate({
          path: "game",
          populate: { path: "_id" },
        })
        .select("-password");

      if (!player) {
        throw new Error(
          "nable to subscribe player account with that id"
        );
      }

      return player;
    } catch (e) {
      throw new Error("nable to subscribe");
    }
  }

  public async renewalSubscription(
    _id: Schema.Types.ObjectId,
    dayOfSubscribe: number,
    subscribeTime: Date
  ): Promise<IPlayer | Error>{
    try {
      const player = await this.player
        .findByIdAndUpdate(
          _id,
          {
            subscribeTime: subscribeTime.setDate(
              subscribeTime.getDate() + dayOfSubscribe
            ),
          },
          { new: true }
        )
        .populate({
          path: "game",
          populate: { path: "_id" },
        })
        .select("-password");

      if (!player) {
        throw new Error(
          "Unable to renew subscription player account with that id"
        );
      }

      return player;
    } catch (e) {
      throw new Error("Unable to renew subscription");
    }
  } 

  public async pushGame(
    _id: Schema.Types.ObjectId,
    game_id: Schema.Types.ObjectId
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findByIdAndUpdate(
          { _id },
          {
            $push: {
              game: game_id,
            },
          },
          { new: true }
        )
        .populate({ path: "game", populate: { path: "_id" } })
        .select("-password");

      if (!player) {
        throw new Error("Unable to update player with thad id");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to update player");
    }
  }

  public async getAllPlayers(): Promise<IPlayer | Array<IPlayer> | Error> {
    try {
      const player = await this.player
        .find({}, null, {
          sort: { createdAt: -1 },
        })
        .populate({ path: "game", populate: { path: "_id" } })
        .select("-password");

      if (!player) {
        throw new Error("Unable to find players");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to find players");
    }
  }

  public async getPlayer(_id: Schema.Types.ObjectId): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findById(_id)
        .populate({ path: "game", populate: { path: "_id" } })
        .select("-password");

      if (!player) {
        throw new Error("No logged in player account");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to get player account");
    }
  }

  public async delete(_id: Schema.Types.ObjectId): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findByIdAndDelete(_id)
        .populate({
          path: "game",
          populate: { path: "_id" },
        })
        .select("-password");

      if (!player) {
        throw new Error("Unable to delete player account with that id");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to delete player account");
    }
  }
}

export default PlayerService;