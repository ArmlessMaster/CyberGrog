import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../utils/interfaces";
import HttpException from "../../utils/exception";
import PlayerService from "./service";
import validate from './validation';
import { authenticatedMiddleware, validationMiddleware } from "../../middlewares";

class PlayerController implements IController {
  public path = "/player";
  public router = Router();
  private PlayerService = new PlayerService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.put(
      `${this.path}/update/password`,
      validationMiddleware(validate.updatePassword),
      authenticatedMiddleware,
      this.updatePassword
    );

    this.router.put(
      `${this.path}/subscription`,
      validationMiddleware(validate.subscription),
      authenticatedMiddleware,
      this.subscription
    );

    this.router.put(
      `${this.path}/renewal`,
      validationMiddleware(validate.renewalSubscription),
      authenticatedMiddleware,
      this.renewalSubscription
    );

    this.router.put(
      `${this.path}/push`,
      validationMiddleware(validate.pushGame),
      authenticatedMiddleware,
      this.pushGame
    );

    this.router.get(
      `${this.path}/all`,
      authenticatedMiddleware,
      this.getAllPlayers
    );

    this.router.get(
      `${this.path}/get`,
      validationMiddleware(validate.getPlayer),
      authenticatedMiddleware,
      this.getPlayer
    );

    this.router.get(
      `${this.path}/me`,
      authenticatedMiddleware, 
      this.getMe
    );

    this.router.delete(
      `${this.path}/delete`,
      validationMiddleware(validate.deletePlayer),
      authenticatedMiddleware,
      this.delete
    );
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = await this.PlayerService.login(email, password);

      res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const token = await this.PlayerService.register(email, password);

      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { new_password, password } = req.body;
      const _id = req.player._id;

      const player = await this.PlayerService.updatePassword(
        _id,
        new_password,
        password
      );

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private subscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { dayOfSubscribe } = req.body;
      const _id = req.player._id;

      const player = await this.PlayerService.subscription(_id, dayOfSubscribe);

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private renewalSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { dayOfSubscribe } = req.body;
      const _id = req.player._id;
      const subscribeTime = req.player.subscribeTime;

      const player = await this.PlayerService.renewalSubscription(_id, dayOfSubscribe, subscribeTime);

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private pushGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.player._id;
      const { game_id } = req.body;

      const player = await this.PlayerService.pushGame(_id, game_id);

      res.status(200).json({ player });
    } catch (error) {
      next(new HttpException(400, "Cannot update player"));
    }
  };

  private getAllPlayers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const player = await this.PlayerService.getAllPlayers();

      res.status(200).json({ player });
    } catch (error) {
      next(new HttpException(400, "Cannot found player"));
    }
  };

  private getPlayer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id } = req.body;

      const player = await this.PlayerService.getPlayer(_id);

      res.status(200).json({ player });
    } catch (error) {
      next(new HttpException(400, "Cannot found player"));
    }
  };

  private getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.player._id;

      const player = await this.PlayerService.getPlayer(_id);

      res.status(200).json({ player });
    } catch (error) {
      next(new HttpException(400, "Cannot found player"));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.player._id;

      const player = await this.PlayerService.delete(_id);

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PlayerController;