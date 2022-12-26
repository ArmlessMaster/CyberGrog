import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../utils/interfaces";
import HttpException from "../../utils/exception";
import GameService from "./service";
import validate from "./validation";
import {
  authenticatedMiddleware,
  validationMiddleware,
} from "../../middlewares";
import Props from "../../utils/props";

class GameController implements IController {
  public path = "/game";
  public router = Router();
  private GameService = new GameService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(validate.createGame),
      authenticatedMiddleware,
      this.createGame
    );

    this.router.get(
      `${this.path}/get`,
      validationMiddleware(validate.getGames),
      authenticatedMiddleware,
      this.getGames
    );

    this.router.get(
      `${this.path}/one`,
      validationMiddleware(validate.getGame),
      authenticatedMiddleware,
      this.getGame
    );

    this.router.delete(
      `${this.path}/delete`,
      validationMiddleware(validate.deleteGame),
      authenticatedMiddleware,
      this.deleteGame
    );
  }

  private createGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.player._id;

      const {
        HeartbeatRate,
        BreathRate,
        VascularPressureRateSystolic,
        VascularPressureRateDiastolic,
        gameId,
      } = req.body;

      const game = await this.GameService.createGame(
        _id,
        HeartbeatRate,
        BreathRate,
        VascularPressureRateSystolic,
        VascularPressureRateDiastolic,
        gameId
      );

      res.status(201).json({ game });
    } catch (error) {
      next(new HttpException(400, "Cannot create game"));
    }
  };

  private getGames = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const props = req.body as Props;

      const game = await this.GameService.getGames(props);

      res.status(200).json({ game });
    } catch (error) {
      next(new HttpException(400, "Cannot found games"));
    }
  };

  private getGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { gameId } = req.body;
      const game = await this.GameService.getGame(gameId);

      res.status(200).json({ game });
    } catch (error) {
      next(new HttpException(400, "Cannot found game"));
    }
  };

  private deleteGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, gameId } = req.body;

      const game = await this.GameService.deleteGame(_id, gameId);

      res.status(200).json({ game });
    } catch (error) {
      next(new HttpException(400, "Cannot delete game"));
    }
  };
}

export default GameController;