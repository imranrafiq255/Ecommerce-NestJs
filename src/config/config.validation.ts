import * as Joi from "joi";

export const schemaValidation = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    PORT: Joi.number().port().default(3000),
    DATABASE_URL: Joi.string().required(),
    REDIS_URL : Joi.string().required(),
    JWT_ACCESS_SECRET : Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN : Joi.string().required(),
    JWT_REFRESH_SECRET : Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRES_IN : Joi.string().required()
})