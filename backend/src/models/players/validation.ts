import Joi from "joi";

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const updatePassword = Joi.object({
  _id: Joi.string().hex().length(24),
  password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required()
});

const subscription = Joi.object({
    _id: Joi.string().hex().length(24),
    dayOfSubscribe: Joi.number()
});

const renewalSubscription = Joi.object({
  _id: Joi.string().hex().length(24),
  dayOfSubscribe: Joi.number(),
  subscribeTime: Joi.date()
});

const pushGame = Joi.object({
    _id: Joi.string().hex().length(24),
    game_id: Joi.string().hex().length(24).required()
});

const getPlayer = Joi.object({
    _id: Joi.string().hex().length(24).required()
});

const deletePlayer = Joi.object({
  _id: Joi.string().hex().length(24)
});

export default {
  register,
  login,
  updatePassword,
  subscription,
  renewalSubscription,
  pushGame,
  getPlayer,
  deletePlayer
};