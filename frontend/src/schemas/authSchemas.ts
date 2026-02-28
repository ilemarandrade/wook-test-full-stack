import Joi from 'joi';
import type { TFunction } from 'i18next';

export interface LoginFormValues {
  email: string;
  password: string;
}

/** Mensajes de validación genéricos (validation.required, validation.emailInvalid, etc.) */
const msg = (t: TFunction, key: string) => t(`validation.${key}`);

/**
 * Crea el schema de login con mensajes de error traducidos.
 * Usa claves genéricas (validation.*) sin nombre de campo.
 */
export function createLoginSchema(t: TFunction) {
  const m = (k: string) => msg(t, k);
  return Joi.object<LoginFormValues>({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': m('required'),
        'any.required': m('required'),
        'string.email': m('emailInvalid'),
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.empty': m('required'),
        'any.required': m('required'),
        'string.min': m('minLength8'),
      }),
  });
}

/** @deprecated Usar createLoginSchema(t) para mensajes traducidos */
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

/**
 * Crea el schema de registro con mensajes de error traducidos.
 * Usa claves genéricas (validation.*) sin nombre de campo.
 */
export function createRegisterSchema(t: TFunction) {
  const m = (k: string) => msg(t, k);
  const req = { 'string.empty': m('required'), 'any.required': m('required') };
  return Joi.object<RegisterFormValues>({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({ ...req, 'string.min': m('minLength2'), 'string.max': m('maxLength100') }),
    lastname: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({ ...req, 'string.min': m('minLength2'), 'string.max': m('maxLength100') }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({ ...req, 'string.email': m('emailInvalid') }),
    document: Joi.string()
      .pattern(/^\d+$/)
      .min(7)
      .max(15)
      .required()
      .messages({
        ...req,
        'string.pattern.base': m('onlyDigits'),
        'string.min': m('length7To15'),
        'string.max': m('length7To15'),
      }),
    phone: Joi.string()
      .pattern(/^\d+$/)
      .min(7)
      .max(15)
      .required()
      .messages({
        ...req,
        'string.pattern.base': m('onlyDigits'),
        'string.min': m('length7To15'),
        'string.max': m('length7To15'),
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({ ...req, 'string.min': m('minLength8') }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        ...req,
        'any.only': m('passwordsDoNotMatch'),
      }),
  });
}

/** @deprecated Usar createRegisterSchema(t) para mensajes traducidos */
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

