import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

import IPlayer from "./interface";
import generatePasswordHash from "../../utils/generatePasswordHash";

const PlayerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    nickname: {
      type: String,
    },
    region: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Moderator"],
    },
    subscribeTime: {
      type: Date,
    },
    paymentKeys: {
      type: Array<string>,
      default: [],
    },
    allPaymentKeys: {
      type: Array<string>,
      default: [],
    },
    game: [{ type: Number, ref: "Games" }],
  },
  {
    timestamps: true,
  }
);

PlayerSchema.pre<IPlayer>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await generatePasswordHash(this.password);

  this.password = hash;

  next();
});

PlayerSchema.methods.isValidPremium = async function (): Promise<
  Error | boolean
> {
  return new Date(Date.now()) < this.subscribeTime;
};

PlayerSchema.pre<IPlayer>("findOneAndUpdate", async function (this) {
  const update: any = { ...this.getUpdate() };

  if (update.password) {
    update.password = await generatePasswordHash(update.password);
    this.setUpdate(update);
  }
});

PlayerSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IPlayer>("Players", PlayerSchema);