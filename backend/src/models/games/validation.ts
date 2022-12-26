import Joi from "joi";

const createGame = Joi.object({
  HeartbeatRate: Joi.number(),
  BreathRate: Joi.number(),
  VascularPressureRateSystolic: Joi.number(),
  VascularPressureRateDiastolic: Joi.number(),
  gameId: Joi.number(),
});

const getGames = Joi.object({
  limit: Joi.number().default(0),
});

const getGame = Joi.object({
  gameId: Joi.number().required(),
});

const deleteGame = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  gameId: Joi.number().required(),
});

export default {
  createGame,
  getGames,
  getGame,
  deleteGame,
};