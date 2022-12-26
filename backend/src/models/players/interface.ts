import { Document } from "mongoose";

export default interface IPlayer extends Document {
  email: string;
  password: string;
  nickname: string;
  region: string;
  subscribeTime: Date;
  role: string;
  paymentKeys: Array<string>;
  allPaymentKeys: Array<string>;
  game: {
    type: Array<Number>;
    ref: string;
  };

  getUpdate(): Promise<Error | Object>;
  setUpdate(obj: Object): Promise<Error | boolean>;
  isValidPassword(passwod: string): Promise<Error | boolean>;
  isValidPremium(): Promise<Error | boolean>;
}