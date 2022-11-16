import Joi from "joi";

const createGame = Joi.object({
  HeartbeatRate: Joi.number(),
  BreathRate: Joi.number(),
  VascularPressureRateSystolic: Joi.number(),
  VascularPressureRateDiastolic: Joi.number()
});

const pushRatesGame = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  HeartbeatRate: Joi.number(), 
  BreathRate: Joi.number(),
  VascularPressureRateSystolic: Joi.number(),
  VascularPressureRateDiastolic: Joi.number()
});

const getGames = Joi.object({
  limit: Joi.number().default(0)
});

const getGame = Joi.object({
  _id: Joi.string().hex().length(24).required()
});

const deleteGame = Joi.object({
  _id: Joi.string().hex().length(24).required()
});

export default {
  createGame,
  pushRatesGame,
  getGames,
  getGame,
  deleteGame,
};