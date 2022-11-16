import { Document, Schema } from "mongoose";

export default interface IPlayer extends Document {
  email: string;
  password: string;
  isSubscribe: boolean;
  subscribeTime: Date;
  game: {
    type: Array<Schema.Types.ObjectId>;
    ref: string;
  };

  getUpdate(): Promise<Error | Object>;
  setUpdate(obj: Object): Promise<Error | boolean>;
  isValidPassword(passwod: string): Promise<Error | boolean>;
}