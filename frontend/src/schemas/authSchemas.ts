import Joi from 'joi';

export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginSchema = Joi.object<LoginFormValues>({
  email: Joi.string()
    .email()
    .required()
    .label('Email'),
  password: Joi.string().min(8).required().label('Password'),
});

export interface RegisterFormValues {
  name: string;
  lastname?: string;
  email: string;
  document: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export const registerSchema = Joi.object<RegisterFormValues>({
  name: Joi.string().min(2).max(100).required().label('Name'),
  lastname: Joi.string().min(2).max(100).required().label('Lastname'),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('Email'),
  document: Joi.string()
    .pattern(/^\d+$/)
    .min(7)
    .max(15)
    .required()
    .label('Document'),
  phone: Joi.string()
    .pattern(/^\d+$/)
    .min(7)
    .max(15)
    .required()
    .label('Phone'),
  password: Joi.string().min(8).required().label('Password'),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({
      'any.only': 'Passwords do not match',
    }),
});

export interface ProfileFormValues {
  name: string;
  lastname?: string;
  document: string;
  phone?: string;
}

export const profileSchema = Joi.object<ProfileFormValues>({
  name: Joi.string().min(2).max(100).required().label('Name'),
  lastname: Joi.string().min(2).max(100).required().label('Lastname'),
  document: Joi.string()
    .pattern(/^\d+$/)
    .min(7)
    .max(15)
    .required()
    .label('Document'),
  phone: Joi.string()
    .pattern(/^\d+$/)
    .min(7)
    .max(15)
    .required()
    .label('Phone'),
});

