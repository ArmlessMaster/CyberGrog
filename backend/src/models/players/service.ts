import { Schema } from "mongoose";

import PlayerModel from "./model";
import token from "../../utils/token";
import IPlayer from "./interface";
import Props from "../../utils/props";

const RiotRequest = require("riot-lol-api");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 10 });

var cache = {
  get: function (region: string, endpoint: string, cb: Function) {
    if (myCache.has(`${region}${endpoint}`)) {
      cb(null, myCache.get(`${region}${endpoint}`));
    } else {
      cb(null, null);
    }
  },
  set: function (
    region: string,
    endpoint: string,
    cacheStrategy: boolean,
    data: Props
  ) {
    myCache.set(`${region}${endpoint}`, data);
  },
};

const stripe = require("stripe")(process.env.STRIPE_KEY);

class PlayerService {
  private player = PlayerModel;
  private sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private riotRequest = new RiotRequest(process.env.LOL_API_KEY, cache);

  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const player = await this.player.findOne({ email });
      if (!player) {
        throw new Error(
          "Unable to find player account with that email address"
        );
      }

      await this.player
        .findOneAndUpdate(
          { email: email },
          {
            allPaymentKeys: [],
          },
          { new: true }
        )
        .exec();

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
    password: string,
    nickname: string,
    region: string
  ): Promise<string | Error> {
    try {
      const playerExists = await this.player.findOne({ email });

      if (playerExists) {
        throw new Error("Player account already exists");
      }

      const player = await this.player.create({
        email,
        password,
        nickname,
        region,
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
        const player = await this.player.findByIdAndUpdate(
          _id,
          { password: new_password },
          { new: true }
        );

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

  public async update(
    _id: Schema.Types.ObjectId,
    nickname: string,
    region: string
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player.findByIdAndUpdate(
        _id,
        {
          nickname,
          region,
        },
        { new: true }
      );

      if (!player) {
        throw new Error("Unable to update player account with that data");
      }

      return player;
    } catch (error) {
      throw new Error("The old password does not match the entered one");
    }
  }

  public async subscription(
    player: IPlayer,
    dayOfSubscribe: number,
    key: string
  ): Promise<IPlayer | Error> {
    try {
      const current_player = await this.player.findOne({
        _id: player._id,
      });

      if (!current_player) {
        throw new Error("Unable to find this player");
      }

      const paymentKeys = current_player.paymentKeys;
      const allPaymentKeys = current_player.allPaymentKeys;

      if (paymentKeys.includes(key) || !allPaymentKeys.includes(key)) {
        throw new Error("Unable to renew premium");
      } else {
        await this.player.findOneAndUpdate(
          { _id: player._id },
          { $push: { paymentKeys: key } }
        );
      }

      let newSubscribeTime = new Date();
      if (player.subscribeTime) {
        if (new Date(Date.now()) < player.subscribeTime) {
          newSubscribeTime = player.subscribeTime;
        } else {
          newSubscribeTime = new Date(Date.now());
        }
      }
      newSubscribeTime.setDate(newSubscribeTime.getDate() + dayOfSubscribe);

      const plr = await this.player
        .findByIdAndUpdate(
          player._id,
          { $set: { subscribeTime: newSubscribeTime } },
          { new: true }
        )
        .select(["-password"])
        .exec();

      if (!plr) {
        throw new Error("Unable to premium renew with that data");
      }
      return plr;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async payment(
    player: IPlayer,
    dayOfSubscribe: number,
    price: number,
    my_domain: string,
    name: string,
    key: string
  ): Promise<string | Error> {
    try {
      await this.player.findOneAndUpdate(
        { _id: player._id },
        { $push: { allPaymentKeys: key } }
      );

      const line_items = [
        {
          price_data: {
            currency: "uah",
            product_data: {
              name: name + " " + dayOfSubscribe + " " + "days",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ];
      const time = new Date().getTime();

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${my_domain}/success/${key}/${time}/${dayOfSubscribe}`,
        cancel_url: `${my_domain}/canceled`,
      });

      return session.url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getLoLAccount(
    region: string,
    nickname: string
  ): Promise<Props | void | Error> {
    try {
      await this.riotRequest.request(
        region,
        "summoner",
        `/lol/summoner/v4/summoners/by-name/${nickname}`,
        true,
        function (err: any, data: Props) {}
      );

      if (
        !myCache.get(`${region}/lol/summoner/v4/summoners/by-name/${nickname}`)
      ) {
        await this.sleep(750);
      }

      const cache1 = myCache.get(
        `${region}/lol/summoner/v4/summoners/by-name/${nickname}`
      );

      await this.riotRequest.request(
        region,
        "league",
        `/lol/league/v4/entries/by-summoner/${cache1.id}`,
        true,
        function (err: any, data: Props) {}
      );

      if (!myCache.get(`/lol/league/v4/entries/by-summoner/${cache1.id}`)) {
        await this.sleep(750);
      }

      const cache2 = myCache.get(
        `${region}/lol/league/v4/entries/by-summoner/${cache1.id}`
      );

      cache2[0].profileIconId = cache1.profileIconId;
      cache2[0].summonerLevel = cache1.summonerLevel;

      return cache2[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async active_game(region: string, id: string): Promise<Props | Error> {
    try {
      await this.riotRequest.request(
        region,
        "spectator",
        `/lol/spectator/v4/active-games/by-summoner/${id}`,
        true,
        function (err: any, data: Props) {}
      );

      if (
        !myCache.get(
          `${region}/lol/spectator/v4/active-games/by-summoner/${id}`
        )
      ) {
        await this.sleep(1000);
      }

      return myCache.get(
        `${region}/lol/spectator/v4/active-games/by-summoner/${id}`
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async pushGame(
    _id: Schema.Types.ObjectId,
    gameId: Number
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player.findByIdAndUpdate(
        { _id },
        {
          $push: {
            game: gameId,
          },
        },
        { new: true }
      );

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
      const player = await this.player.find({});

      if (!player) {
        throw new Error("Unable to find players");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to find players");
    }
  }

  public async getAllUsers(): Promise<IPlayer | Array<IPlayer> | Error> {
    try {
      const player = await this.player.find({ role: { $ne: "Admin" } });

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
      const player = await this.player.findById(_id);

      if (!player) {
        throw new Error("No logged in player account");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to get player account");
    }
  }

  public async getPlayerLastGame(
    _id: Schema.Types.ObjectId
  ): Promise<IPlayer | Error> {
    try {
      const player = (await this.player.findById(_id)) as any;

      if (!player) {
        throw new Error("No logged in player account");
      }

      const gamesArr = player.game as any;

      const lastGame = gamesArr[player.game.length - 1];

      return lastGame;
    } catch (error) {
      throw new Error("Unable to get player account");
    }
  }

  public async delete(_id: Schema.Types.ObjectId): Promise<IPlayer | Error> {
    try {
      const player = await this.player.findByIdAndDelete(_id);

      if (!player) {
        throw new Error("Unable to delete player account with that id");
      }

      return player;
    } catch (error) {
      throw new Error("Unable to delete player account");
    }
  }

  public async adminDelete(
    _id: Schema.Types.ObjectId
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findByIdAndDelete(_id)
        .select(["-password"])
        .exec();

      if (!player) {
        throw new Error("Unable to delete player with that data");
      }

      return player;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async adminUpdate(
    _id: Schema.Types.ObjectId,
    role: string
  ): Promise<IPlayer | Error> {
    try {
      const player = await this.player
        .findByIdAndUpdate(
          _id,
          {
            role: role,
          },
          { new: true }
        )
        .select(["-password"])
        .exec();

      if (!player) {
        throw new Error("Unable to update player with that data");
      }

      return player;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default PlayerService;