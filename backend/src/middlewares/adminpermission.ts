import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import token from "../utils/token";
import PlayerModel from "../models/players/model";
import { IToken } from "../utils/interfaces";
import HttpException from "../utils/exception";

async function adminPermissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();
  try {
    const payload: IToken | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorised"));
    }

    const account = await PlayerModel.findById(payload.id).exec();

    if (!account) {
      return next(new HttpException(401, "Unauthorised"));
    } else if (account.role !== "Admin" && account.role !== "Moderator") {
      return next(new HttpException(401, "Access is denied"));
    }

    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorised"));
  }
}

export default adminPermissionMiddleware;