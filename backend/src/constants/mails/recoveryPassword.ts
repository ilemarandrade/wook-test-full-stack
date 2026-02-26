interface IRecoverPassword {
  en: (t: string) => string;
  es: (t: string) => string;
}

const recoveryPassword: IRecoverPassword = {
  en: (token_to_reset_password) => `
  <div style="text-align: center; font-family: Arial; font-size: 20px;">
    <p>To change your password very easily, you just have to click the new password button and follow the steps we indicate. This way you can continue enjoying the Wallet Andrade app with total security and comfort. 😊</p>
    <a href="${process.env.REDIRECT_URL_TO_NEW_PASSWORD}?token=${token_to_reset_password}" target="_blank" style="color: white; text-decoration: none;"> 
      <button style="color: white;font-weight: 600; background-color: #1ab187;border-radius: 10px;height: 56px;padding: 6px 16px;font-size: 0.875rem;min-width: 64px;">
        NEW PASSWORD
      </button>
    </a>
  </div>
`,
  es: (token_to_reset_password) => `
  <div style="text-align: center; font-family: Arial; font-size: 20px;">
    <p>Para cambiar tu clave de manera muy sencilla, solo tienes que clickear el botón nueva contraseña y seguir los pasos que te indicamos. Así podrás seguir disfrutando de la app Wallet Andrade con total seguridad y comodidad. 😊</p>
    <a href="${process.env.REDIRECT_URL_TO_NEW_PASSWORD}?token=${token_to_reset_password}" target="_blank" style="color: white; text-decoration: none;">
      <button style="color: white;font-weight: 600; background-color: #1ab187;border-radius: 10px;height: 56px;padding: 6px 16px;font-size: 0.875rem;min-width: 64px;">
        NUEVA CONTRASEÑA
      </button>
    </a>
  </div>`,
};

export default recoveryPassword;
