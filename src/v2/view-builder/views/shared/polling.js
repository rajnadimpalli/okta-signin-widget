import { _ } from 'okta';
import { MS_PER_SEC } from '../../utils/Constants';

export default {
  startPolling (newInterval) {
    this.pollingInterval = newInterval || this.options.currentViewState.refresh;
    this.countDownCounterValue = Math.ceil(this.pollingInterval / MS_PER_SEC);
    // Poll is present in remediation form
    if (this.pollingInterval) {
      this._startRemediationPolling();
    } else {
      // Poll is present in authenticator/ authenticator Enrollment obj.
      // Authenticator won't co-exists hence it's safe to trigger both.
      this._startAuthenticatorPolling();
    }
  },

  _startAuthenticatorPolling () {
    // Authenticator won't co-exists hence it's safe to trigger both.
    [
      'currentAuthenticator',
      'currentAuthenticatorEnrollment',
    ].some(responseKey => {
      if (this.options.appState.has(responseKey)) {
        const authenticator = this.options.appState.get(responseKey);
        const authenticatorPollAction = `${responseKey}-poll`;
        const pollInterval = authenticator?.poll?.refresh;
        if (_.isNumber(pollInterval)) {
          this.polling = setInterval(()=>{
            this.options.appState.trigger('invokeAction', authenticatorPollAction);
          }, pollInterval);
        }
        return true;
      } else {
        return false;
      }
    });
  },

  startCountDown (selector , interval) {
    if(this.countDown) {
      clearInterval(this.countDown);
    }
    this.counterEl = this.$el.find(selector);
    this.countDown = setInterval(() => {
      if(this.counterEl.text() !== '1') {
        this.counterEl.text(this.counterEl.text() - 1);
      } else {
        // reset the countdown counter visible to enduser, if still polling
        this.counterEl.text(this.countDownCounterValue);
        this.startCountDown(selector, interval);
      }
    }, interval, this);
  },

  _stopCountDown () {
    if(this.countDown) {
      clearInterval(this.countDown);
    }
  },

  _startRemediationPolling () {
    if (_.isNumber(this.pollingInterval)) {
      this.polling = setInterval(() => {
        this.options.appState.trigger('saveForm', this.model);
      }, this.pollingInterval);
    }
  },

  stopPolling () {
    if (this.polling) {
      this._stopCountDown();
      clearInterval(this.polling);
    }
  }
};
