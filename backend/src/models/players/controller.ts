import { Router, Request, Response, NextFunction } from "express";

import { IController } from "../../utils/interfaces";
import HttpException from "../../utils/exception";
import PlayerService from "./service";
import validate from "./validation";
import {
  authenticatedMiddleware,
  validationMiddleware,
  adminPermissionMiddleware,
} from "../../middlewares";
import IPlayer from "./interface";
import Props from "../../utils/props";

class PlayerController implements IController {
  public path = "/player";
  public router = Router();
  private PlayerService = new PlayerService();
  private client_url = process.env.CLIENT_URL;

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
      `${this.path}/update`,
      validationMiddleware(validate.update),
      authenticatedMiddleware,
      this.update
    );

    this.router.put(
      `${this.path}/subscription`,
      validationMiddleware(validate.subscription),
      authenticatedMiddleware,
      this.subscription
    );

    this.router.put(
      `${this.path}/payment`,
      validationMiddleware(validate.payment),
      authenticatedMiddleware,
      this.payment
    );

    this.router.get(
      `${this.path}/subscription/status`,
      authenticatedMiddleware,
      this.getPremiumStatus
    );

    this.router.put(
      `${this.path}/admin/update`,
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminUpdate
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
      `${this.path}/users`,
      authenticatedMiddleware,
      this.getAllUsers
    );

    this.router.get(
      `${this.path}/get`,
      validationMiddleware(validate.getPlayer),
      authenticatedMiddleware,
      this.getPlayer
    );

    this.router.get(`${this.path}/me`, authenticatedMiddleware, this.getMe);

    this.router.get(
      `${this.path}/last`,
      authenticatedMiddleware,
      this.getPlayerLastGame
    );

    this.router.get(
      `${this.path}`,
      authenticatedMiddleware,
      this.getPlayerAccount
    );

    this.router.get(
      `${this.path}/getLoLAccount`,
      validationMiddleware(validate.getLoLAccount),
      this.getLoLAccount
    );

    this.router.get(
      `${this.path}/active-game`,
      validationMiddleware(validate.active_game),
      this.active_game
    );

    this.router.delete(
      `${this.path}/delete`,
      validationMiddleware(validate.deletePlayer),
      authenticatedMiddleware,
      this.delete
    );

    this.router.delete(
      `${this.path}/admin/delete`,
      authenticatedMiddleware,
      adminPermissionMiddleware,
      this.adminDelete
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
      const { email, password, nickname, region } = req.body;

      const token = await this.PlayerService.register(
        email,
        password,
        nickname,
        region
      );

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

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { nickname, region } = req.body;
      const _id = req.player._id;

      const player = await this.PlayerService.update(_id, nickname, region);

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
      const { dayOfSubscribe, key } = req.body;

      const player = (await this.PlayerService.subscription(
        req.player,
        dayOfSubscribe,
        key
      )) as IPlayer;

      res.status(200).json({ data: player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private payment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { dayOfSubscribe, price, name, key } = req.body;

      const url = await this.PlayerService.payment(
        req.player,
        dayOfSubscribe,
        price,
        this.client_url as string,
        name,
        key
      );

      res.status(200).json({ data: url });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getPremiumStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.player) {
        return next(new HttpException(404, "No logged in account"));
      }
      const isSubscribe = await req.player.isValidPremium();

      res.status(200).send({ data: isSubscribe });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private active_game = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { region, id } = req.body as Props;
      const data = await this.PlayerService.active_game(region, id);

      res.status(201).json({ data });
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
      const { gameId } = req.body;

      const player = await this.PlayerService.pushGame(_id, gameId);

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

  private getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const player = await this.PlayerService.getAllUsers();

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

  private getPlayerLastGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const _id = req.player._id;

      const game = await this.PlayerService.getPlayerLastGame(_id);

      res.status(200).json({ game });
    } catch (error) {
      next(new HttpException(400, "Cannot found player"));
    }
  };

  private getPlayerAccount = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.player) {
      return next(new HttpException(404, "No logged in account"));
    }

    res.status(200).send({ data: req.player });
  };

  private getLoLAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { region, nickname } = req.body as Props;

      let data = await this.PlayerService.getLoLAccount(region, nickname);

      res.status(201).json({ data });
    } catch (error: any) {
      next(new HttpException(400, error.message));
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

  private adminDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id } = req.body;
      const player = await this.PlayerService.adminDelete(_id);

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private adminUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { _id, role } = req.body;

      const player = await this.PlayerService.adminUpdate(_id, role);

      res.status(200).json({ player });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PlayerController;