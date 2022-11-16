import { Schema, model } from "mongoose";

import IGame from "./interface";

const GameSchema = new Schema(
  {
    HeartbeatRate: [
      {
        type: Number
      },
    ],
    BreathRate: [
      {
        type: Number
      },
    ],
    VascularPressureRateSystolic: [
      {
        type: Number
      },
    ],
    VascularPressureRateDiastolic: [
      {
        type: Number
      },
    ]
  },
  {
    timestamps: true
  }
);

export default model<IGame>("Games", GameSchema);