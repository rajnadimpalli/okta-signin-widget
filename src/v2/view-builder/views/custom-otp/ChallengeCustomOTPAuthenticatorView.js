import { loc } from 'okta';
import BaseForm from '../../internals/BaseForm';
import BaseAuthenticatorView from '../../components/BaseAuthenticatorView';
import AuthenticatorVerifyFooter from '../../components/AuthenticatorVerifyFooter';

const Body = BaseForm.extend(Object.assign(
  {
    className: 'mfa-verify-custom-otp',

    title () {
      const vendorName =
        this.options.appState.get('currentAuthenticatorEnrollment')?.displayName ||
        loc('oie.custom_otp.authenticator.default.vendorName', 'login');
      return loc('oie.verify.custom_otp.title', 'login', [vendorName]);
    },

    subtitle () {
      return loc('oie.verify.custom_otp.description', 'login');
    },

    save () {
      return loc('mfa.challenge.verify', 'login');
    },
  },
));

export default BaseAuthenticatorView.extend({
  Body,
  Footer: AuthenticatorVerifyFooter,
});
