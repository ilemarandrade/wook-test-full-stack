export type TypesTraductions = {
  [key: string]: string | TypesTraductions;
};

const es: TypesTraductions = {
  message: {
    error_unexpected: 'Ha ocurrido un error inesperado',
    success: 'Solicitud Exitosa!',
    create_user: { success: 'Estamos alegres que te hayas unido!' },
    authorization_incorrect: 'Inicia sesión para continuar.',
    login: {
      wrong_data: 'El email o la contraseña no son correctos',
    },
    sign_up: {
      user_exist:
        'Ya existe una cuenta asociada a este correo electrónico o documento',
    },
    forgot_password: {
      check_your_email:
        'Revisa tu correo electrónico para continuar con el proceso de recuperación de contraseña',
      title_email: 'Instrucciones para recuperación de contraseña',
      success_update_password: 'Contraseña actualizada con éxito',
      passwords_do_not_match: 'Contraseñas no coinciden',
      expired_token:
        'Token expirado debes solicitar de nuevo recuperar contraseña',
    },
  },
};

export default es;
