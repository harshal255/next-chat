import Joi from "joi";

// Joi validation schema for registration
export const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(50).trim(),
    email: Joi.string().email().required().custom((value: string, helpers) => {
        if (value.endsWith('bot')) {
            return helpers.error('any.invalid');
        }
        return value;
    }),
    password: Joi.string().required().min(6),
});