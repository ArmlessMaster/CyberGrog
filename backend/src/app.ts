import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { IController } from "./utils/interfaces";
import { errorsMiddleware } from "./middlewares";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: IController[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: IController[]): void {
    controllers.forEach((controller: IController) => {
      this.express.use("/api", controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(errorsMiddleware);
  }

  private initialiseDatabaseConnection(): void {
    mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH}`
    );
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server: http://localhost:${this.port}`);
    });
  }
}

export default App;