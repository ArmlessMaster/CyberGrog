import jwt from "jsonwebtoken";

import IPlayer from "../models/players/interface";
import { IToken } from "./interfaces";

export const createToken = (player: IPlayer): string => {
  return jwt.sign({ id: player._id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: "1d",
  });
};

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | IToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload as IToken);
    });
  });
};

export default { createToken, verifyToken };