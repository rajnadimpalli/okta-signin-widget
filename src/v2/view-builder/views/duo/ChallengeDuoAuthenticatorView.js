import { loc } from 'okta';
import BaseDuoAuthenticatorForm from './BaseDuoAuthenticatorForm';
import BaseAuthenticatorView from '../../components/BaseAuthenticatorView';
import AuthenticatorVerifyFooter from '../../components/AuthenticatorVerifyFooter';

const Body = BaseDuoAuthenticatorForm.extend({
  title () {
    return loc('oie.duo.verify.title', 'login');
  },
});

export default BaseAuthenticatorView.extend({
  Body,
  Footer: AuthenticatorVerifyFooter,
});
