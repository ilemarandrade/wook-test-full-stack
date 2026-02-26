import Joi from 'joi';

export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginSchema = Joi.object<LoginFormValues>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('Email'),
  password: Joi.string().min(6).required().label('Password'),
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
  lastname: Joi.string().allow('', null).label('Lastname'),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('Email'),
  document: Joi.string().min(3).max(50).required().label('Document'),
  phone: Joi.string().allow('', null).label('Phone'),
  password: Joi.string().min(6).required().label('Password'),
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
  lang: string;
}

export const profileSchema = Joi.object<ProfileFormValues>({
  name: Joi.string().min(2).max(100).required().label('Name'),
  lastname: Joi.string().allow('', null).label('Lastname'),
  document: Joi.string().min(3).max(50).required().label('Document'),
  phone: Joi.string().allow('', null).label('Phone'),
  lang: Joi.string().valid('en', 'es').required().label('Language'),
});

