import { Document } from "mongoose";

export default interface IGame extends Document {
  HeartbeatRate: Array<Number>;
  BreathRate: Array<Number>;
  VascularPressureRateSystolic: Array<Number>;
  VascularPressureRateDiastolic: Array<Number>;
}