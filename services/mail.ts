
class MailService {
  private readonly i18n: any
  private readonly $axios: any
  private readonly $store: any

  constructor(context: any) {
    this.i18n = context.i18n;
    this.$axios = context.$axios;
    this.$store = context.$store;
  }

  verificationCode(code: string) {
    if (!code) return;

    const { name, email } = this.$store.getters.getUser;
    const options = {
      mail: {
        from: 'contadesenvolvedor@gmail.com',
        to: email,
        subject: this.i18n.t('mail.verification_code.subject'),
      },
      content: {
        greeting: this.i18n.t('mail.verification_code.greeting', { name: name }),
        header: this.i18n.t('mail.verification_code.header'),
        code,
        description: this.i18n.t('mail.verification_code.description'),
      },
    };

    this.$axios.post(`/mail/verification-code`, options);
  }

  forgetPassword(email: string, token: string) {
    if (!email || !token) return;

    const callback = this.$store.getters.getCallback;
    const options = {
      mail: {
        from: 'contadesenvolvedor@gmail.com',
        to: email,
        subject: this.i18n.t('mail.forget_password.subject'),
      },
      content: {
        header: this.i18n.t('mail.forget_password.header'),
        subheader: this.i18n.t('mail.forget_password.subheader'),
        button: this.i18n.t('mail.forget_password.button'),
        href: `http://localhost:3000/forget-password?token=${token}&callback=${callback}`,
        description: this.i18n.t('mail.forget_password.description'),
      },
    };

    this.$axios.post(`/mail/forget-password`, options);
  }
}

export default MailService