import { TypesTraductions } from './es';

const en: TypesTraductions = {
  message: {
    error_unexpected: 'An unexpected error has occurred',
    success: 'Request Successful!',
    create_user: { success: "We're glad you joined!" },
    authorization_incorrect: 'Login to continue.',
    bad_request: {
      dto_invalid: 'The provided data is not valid',
    },
    login: {
      wrong_data: 'Email or password was not correct',
    },
    sign_up: {
      user_exist:
        'There is already an account associated with this email or document',
    },
    forgot_password: {
      check_your_email:
        'Check your email to continue with the password recovery process',
      title_email: 'Password recovery instructions',
      success_update_password: 'Password updated successfully',
      passwords_do_not_match: 'Passwords do not match',
      expired_token: 'Expired token you must request again to recover password',
    },
  },
};

export default en;
