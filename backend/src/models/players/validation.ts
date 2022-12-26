import Joi from "joi";

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  nickname: Joi.string().required(),
  region: Joi.string().required(),
});

const updatePassword = Joi.object({
  _id: Joi.string().hex().length(24),
  password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required(),
});

const update = Joi.object({
  _id: Joi.string().hex().length(24),
  nickname: Joi.string().required(),
  region: Joi.string().required(),
});

const subscription = Joi.object({
  dayOfSubscribe: Joi.number().integer().min(1).required(),
  key: Joi.string().required(),
});

const payment = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  dayOfSubscribe: Joi.number().integer().min(1).required(),
  key: Joi.string().required(),
});

const getLoLAccount = Joi.object({
  region: Joi.string().required(),
  nickname: Joi.string().required(),
});

const active_game = Joi.object({
  region: Joi.string().required(),
  id: Joi.string().required(),
});

const pushGame = Joi.object({
  _id: Joi.string().hex().length(24),
  gameId: Joi.string().required(),
});

const getPlayer = Joi.object({
  _id: Joi.string().hex().length(24).required(),
});

const adminUpdate = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  role: Joi.string().required(),
});

const deletePlayer = Joi.object({
  _id: Joi.string().hex().length(24),
});

export default {
  register,
  login,
  updatePassword,
  subscription,
  pushGame,
  getPlayer,
  deletePlayer,
  payment,
  update,
  getLoLAccount,
  active_game,
  adminUpdate,
};