/* eslint max-params:[0, 2] */
import { $ } from 'okta';
import PrimaryAuthForm from 'helpers/dom/PrimaryAuthForm';
import IdentifierForm from 'helpers/dom/v2/IdentifierForm';
import TerminalView from 'helpers/dom/v2/TerminalView';
import MockUtil from 'helpers/mocks/Util';
import Expect from 'helpers/util/Expect';
import errorResponse from 'helpers/xhr/ERROR_invalid_token';
import introspectResponse from 'helpers/xhr/UNAUTHENTICATED';
import idxResponse from 'helpers/xhr/v2/IDX_IDENTIFY';
import v1Success from 'helpers/xhr/SUCCESS';
import errorFeatureNotEnabled from 'helpers/xhr/v2/ERROR_FEATURE_NOT_ENABLED';
import 'jasmine-ajax';
import Q from 'q';
import $sandbox from 'sandbox';
import Logger from 'util/Logger';
import Widget from 'widget/OktaSignIn';
import V1Router from 'LoginRouter';
const url = 'https://foo.com';
const itp = Expect.itp;

Expect.describe('OktaSignIn initialization', function () {
  let signIn;

  /* eslint jasmine/no-global-setup:0 */
  beforeEach(function () {
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest(/https:\/\/foo.com.*/).andReturn({
      status: 200,
      responseText: '',
    });
    spyOn(Logger, 'warn');
    signIn = new Widget({
      baseUrl: url,
    });
  });
  afterEach(function () {
    jasmine.Ajax.uninstall();
    $sandbox.empty();
  });

  Expect.describe('Debug Mode', function () {
    it('logs a warning message on page load', function () {
      const debugMessage =
        '\n' +
        'The Okta Sign-In Widget is running in development mode.\n' +
        'When you are ready to publish your app, embed the minified version to turn on production mode.\n' +
        'See: https://developer.okta.com/code/javascript/okta_sign-in_widget#cdn\n';

      expect(Logger.warn).toHaveBeenCalledWith(debugMessage);
    });
  });

  Expect.describe('At the root level', function () {
    it('has a renderEl method', function () {
      expect(signIn.renderEl).toBeDefined();
    });
    it('has a authClient method', function () {
      expect(signIn.authClient).toBeDefined();	
    });
    it('has a showSignInToGetTokens method', function () {
      expect(signIn.showSignInToGetTokens).toBeDefined();
    });
    it('has a showSignInAndRedirect method', function () {
      expect(signIn.showSignInAndRedirect).toBeDefined();
    });
    it('has a hide method', function () {
      expect(signIn.hide).toBeDefined();
    });
    it('has a show method', function () {
      expect(signIn.show).toBeDefined();
    });
    it('has a remove method', function () {
      expect(signIn.remove).toBeDefined();
    });
  });

  describe('Auth Client', function () {
    Expect.describe('authClient option', function () {
      it('accepts an authClient option', function () {
        const authClient = { foo: 'bar' };
        signIn = new Widget({
          baseUrl: url,
          authClient,
        });
        expect(signIn.authClient).toBe(authClient);
      });
    });

    Expect.describe('Config', function () {
      it('has an options object', function () {
        expect(signIn.authClient.options).toBeDefined();
      });

      it('SIW passes all config within authParams to OktaAuth', function () {
        const authParams = {
          // known params
          issuer: 'https://my-issuer',
          authorizeUrl: 'fake-url',
          pkce: false,
        };
        signIn = new Widget({
          baseUrl: url,
          authParams,
        });

        Object.keys(authParams).forEach(function (key) {
          expect(signIn.authClient.options[key]).toBe(authParams[key]);
        });
      });

      it('"useInteractionCodeFlow" without PKCE throws a config error', function () {
        const fn = () => {
          signIn = new Widget({
            baseUrl: url,
            useInteractionCodeFlow: true,
            authParams: {
              pkce: false
            }
          });
        };
        expect(fn).toThrowError('The "useInteractionCodeFlow" option requires PKCE to be enabled on the authClient.');
      });
    });

    Expect.describe('Session', function () {
      it('has a session method', function () {
        expect(signIn.authClient.session).toBeDefined();
      });
      it('has a session.close method', function () {
        expect(signIn.authClient.session.close).toBeDefined();
      });
      it('has a session.exists method', function () {
        expect(signIn.authClient.session.exists).toBeDefined();
      });
      it('has a session.get method', function () {
        expect(signIn.authClient.session.get).toBeDefined();
      });
      it('has a session.refresh method', function () {
        expect(signIn.authClient.session.refresh).toBeDefined();
      });
    });

    Expect.describe('Token', function () {
      it('has a token method', function () {
        expect(signIn.authClient.token).toBeDefined();
      });
      it('has a token.getWithoutPrompt method', function () {
        expect(signIn.authClient.token.getWithoutPrompt).toBeDefined();
      });
      it('has a token.getWithPopup method', function () {
        expect(signIn.authClient.token.getWithPopup).toBeDefined();
      });
      it('has a token.getWithRedirect method', function () {
        expect(signIn.authClient.token.getWithRedirect).toBeDefined();
      });
      it('has a token.parseFromUrl method', function () {
        expect(signIn.authClient.token.parseFromUrl).toBeDefined();
      });
      it('has a token.decode method', function () {
        expect(signIn.authClient.token.decode).toBeDefined();
      });
      it('has a token.renew method', function () {
        expect(signIn.authClient.token.renew).toBeDefined();
      });
      it('has a token.getUserInfo method', function () {
        expect(signIn.authClient.token.getUserInfo).toBeDefined();
      });
      it('has a token.verify method', function () {
        expect(signIn.authClient.token.verify).toBeDefined();
      });
    });

    Expect.describe('TokenManager', function () {
      it('has a tokenManager method', function () {
        expect(signIn.authClient.tokenManager).toBeDefined();
      });
      it('has a tokenManager.add method', function () {
        expect(signIn.authClient.tokenManager.add).toBeDefined();
      });
      it('has a tokenManager.get method', function () {
        expect(signIn.authClient.tokenManager.get).toBeDefined();
      });
      it('has a tokenManager.remove method', function () {
        expect(signIn.authClient.tokenManager.remove).toBeDefined();
      });
      it('has a tokenManager.clear method', function () {
        expect(signIn.authClient.tokenManager.clear).toBeDefined();
      });
      it('has a tokenManager.renew method', function () {
        expect(signIn.authClient.tokenManager.renew).toBeDefined();
      });
      it('has a tokenManager.on method', function () {
        expect(signIn.authClient.tokenManager.on).toBeDefined();
      });
      it('has a tokenManager.off method', function () {
        expect(signIn.authClient.tokenManager.off).toBeDefined();
      });
    });
  });

  Expect.describe('events', function () {
    afterEach(function () {
      signIn.remove();
      signIn.off();
    });
    it('triggers an afterRender event when the Widget renders a page', function (done) {
      signIn.renderEl({ el: $sandbox });
      signIn.on('afterRender', function (context) {
        expect(context).toEqual({ controller: 'primary-auth' });
        done();
      });
    });

    it('triggers a ready event when the Widget renders a page', function (done) {
      signIn.renderEl({ el: $sandbox });
      signIn.on('ready', function (context) {
        expect(context).toEqual({ controller: 'primary-auth' });
        done();
      });
    });

    it('triggers a ready event when the Widget is loaded with a recoveryToken', function (done) {
      signIn = new Widget({
        baseUrl: url,
        recoveryToken: 'foo',
      });
      signIn.renderEl({ el: $sandbox });
      signIn.on('ready', function (context) {
        expect(context).toEqual({ controller: 'recovery-loading' });
        done();
      });
    });
    it('triggers a ready event when the Widget is loaded with using idpDiscovery', function (done) {
      signIn = new Widget({
        baseUrl: url,
        features: { idpDiscovery: true },
      });
      signIn.renderEl({ el: $sandbox });
      signIn.on('ready', function (context) {
        expect(context).toEqual({ controller: 'idp-discovery' });
        done();
      });
    });
    it('does not trigger a ready event twice', function (done) {
      signIn.renderEl({ el: '#sandbox' });
      signIn.on('ready', function (context) {
        expect(context).toEqual({ controller: 'primary-auth' });
        // Navigate directly to forgot-password page
        const forgotPasswordLink = document.getElementsByClassName('link js-forgot-password');

        forgotPasswordLink[0].click();
      });
      signIn.on('afterRender', function (context) {
        if (context.controller === 'forgot-password') {
          done();
        }
      });
    });
  });
});

describe('OktaSignIn object API', function () {
  let signIn;
  let router;
  beforeEach(function () {
    spyOn(Logger, 'warn');
    signIn = null;
    router = null;
  });

  afterEach(() => {
    signIn && signIn.remove();
    $sandbox.empty();
  });

  function createWidget (options = {}) {
    signIn = new Widget(Object.assign({
      baseUrl: url,
      features: {
        router: true,
      },
    }, options));
  }

  function submitPrimaryAuthForm () {
    const form = new PrimaryAuthForm($sandbox);
    form.setUsername('fake@fake.com');
    form.setPassword('FakePassword1');
    form.submit();
  }

  function mockRouter () {
    spyOn(V1Router.prototype, 'start').and.callFake(function () {
      router = this;
      router.controller = {
        remove: () => {}
      };
    });
  }

  describe('renderEl', () => {

    describe('router', () => {
      beforeEach(() => {
        mockRouter();
      });

      it('creates a router', () => {
        createWidget();
        signIn.renderEl({ el: $sandbox });
        return Expect.wait(() => {
          return !!router;
        });
      });
      it('throws if a router has already been created', () => {
        createWidget();
        signIn.renderEl({ el: $sandbox });
        return Expect.wait(() => {
          return !!router;
        }).then(() => {
          return signIn.renderEl();
        }).catch(e => {
          expect(e.message).toEqual('An instance of the widget has already been rendered. Call remove() first.');
        });
      });
      it('starts the router', () => {
        createWidget();
        signIn.renderEl({ el: $sandbox });
        expect(V1Router.prototype.start).toHaveBeenCalled();
      });
    });

    it('returns a Promise', () => {
      createWidget();
      const res = signIn.renderEl({ el: $sandbox });
      expect(typeof res.then).toBe('function');
      expect(typeof res.catch).toBe('function');
      expect(typeof res.finally).toBe('function');

      return Expect.wait(() => {
        return $('.primary-auth').length === 1;
      });
    });
  
    describe('success', () => {
      itp('fires success callback', () => {
        createWidget();
        MockUtil.mockAjax(v1Success);
        const successFn = jasmine.createSpy();
        signIn.renderEl({ el: $sandbox }, successFn);
        
        return Expect.wait(() => {
          return $('.primary-auth').length === 1;
        }).then(function () {
          submitPrimaryAuthForm();
          return Expect.wait(() => {
            return successFn.calls.count() > 0;
          });
        }).then(function () {
          expect(successFn).toHaveBeenCalledWith({
            user: v1Success.response._embedded.user,
            type: 'SESSION_SSO',
            status: 'SUCCESS',
            session: {
              token: v1Success.response.sessionToken,
              setCookieAndRedirect: jasmine.any(Function)
            }
          });
        });
      });
      itp('resolves Promise', () => {
        createWidget();
        MockUtil.mockAjax(v1Success);

        Expect.wait(() => {
          return $('.primary-auth').length === 1;
        }).then(function () {
          submitPrimaryAuthForm();
        });
        
        return signIn.renderEl({ el: $sandbox })
          .then(res => {
            expect(res).toEqual({
              user: v1Success.response._embedded.user,
              type: 'SESSION_SSO',
              status: 'SUCCESS',
              session: {
                token: v1Success.response.sessionToken,
                setCookieAndRedirect: jasmine.any(Function)
              }
            });
          });
      });
    });

    describe('error', () => {
      it('fires error callback', () => {
        createWidget();
        const errorFn = jasmine.createSpy();
        signIn.renderEl({ el: undefined }, undefined, errorFn);
        return Expect.wait(() => {
          return errorFn.calls.count() > 0;
        })
          .then(function () {
            const error = errorFn.calls.argsFor(0)[0];
            expect(error.message).toEqual('"el" is a required widget parameter');
          });
      });
      it('rejects Promise', () => {
        mockRouter();
        createWidget();
        return signIn.renderEl({ el: undefined })
          .catch(error => {
            expect(error.message).toEqual('"el" is a required widget parameter');
          });
      });
    });

  });

  describe('showSignInToGetTokens', () => {
    it('calls renderEl', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      mockRouter();
      createWidget({ clientId, redirectUri });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInToGetTokens({ el });
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams: {},
        mode: 'relying-party'
      });
    });
    it('throws error for authorization_code flow', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      mockRouter();
      createWidget({
        el,
        clientId,
        redirectUri,
        authParams: {
          pkce: false,
          responseType: 'code'
        }
      });

      const fn = () => {
        signIn.showSignInToGetTokens();
      };
      expect(fn).toThrowError('"showSignInToGetTokens()" should not be used for authorization_code flow. ' + 
        'Use "showSignInAndRedirect()" instead');
    });
    it('Can override el, clientId, redirectUri', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      mockRouter();
      createWidget({ el: 'orig', clientId: 'original', redirectUri: 'http://original' });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInToGetTokens({ el, clientId, redirectUri });
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams: {},
        mode: 'relying-party'
      });
    });
    it('Can pass additional authParams', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      const authParams = {
        state: 'fake-state',
        nonce: 'fake-nonce',
        scopes: ['a', 'b']
      };
      mockRouter();
      createWidget({ el, clientId, redirectUri });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInToGetTokens(authParams);
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams,
        mode: 'relying-party'
      });
    });
  });

  describe('showSignInAndRedirect', () => {
    it('calls renderEl', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      mockRouter();
      createWidget({ el, clientId, redirectUri });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInAndRedirect();
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams: {},
        mode: 'remediation'
      });
    });
    it('Can override el, clientId, redirectUri', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      mockRouter();
      createWidget({ el: 'orig', clientId: 'original', redirectUri: 'http://original' });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInAndRedirect({ el, clientId, redirectUri });
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams: {},
        mode: 'remediation'
      });
    });
    it('Can pass additional authParams', () => {
      const el = $sandbox;
      const clientId = 'fake';
      const redirectUri = 'http://fake';
      const authParams = {
        state: 'fake-state',
        nonce: 'fake-nonce',
        scopes: ['a', 'b']
      };
      mockRouter();
      createWidget({ el, clientId, redirectUri });
      spyOn(signIn, 'renderEl').and.callThrough();
      signIn.showSignInAndRedirect(authParams);
      expect(signIn.renderEl).toHaveBeenCalledWith({
        el,
        clientId,
        redirectUri,
        authParams,
        mode: 'remediation'
      });
    });
  });

});

Expect.describe('OktaSignIn v1 pipeline bootstrap ', function () {
  let signIn;
  const form = new PrimaryAuthForm($sandbox);
  beforeEach(function () {
    spyOn(Logger, 'warn');
    signIn = new Widget({
      baseUrl: url,
      stateToken: '00stateToken',
      features: {
        router: true,
      },
    });
  });

  afterEach(function () {
    signIn.remove();
  });

  function setupIntrospect (responseData) {
    spyOn(window.history, 'pushState');
    spyOn(signIn.authClient.tx, 'introspect').and.callFake(function () {
      if (responseData.status !== 200) {
        return Q.reject(responseData.response);
      } else {
        return Q({
          data: responseData.response,
        });
      }
    });
    signIn.renderEl({ el: $sandbox });
    return Expect.wait(() => {
      return $('.primary-auth').length === 1;
    });
  }
  Expect.describe('Introspects token and loads primary auth view for old pipeline', function () {
    it('calls introspect API on page load using authjs as client', function () {
      return setupIntrospect(introspectResponse).then(function () {
        expect(window.history.pushState.calls.argsFor(0)[2]).toBe('/signin/refresh-auth-state/00stateToken');
        expect(signIn.authClient.tx.introspect).toHaveBeenCalledWith({ stateToken: '00stateToken' });
        expect(form.isPrimaryAuth()).toBe(true);
        const password = form.passwordField();

        expect(password.length).toBe(1);
        expect(password.attr('type')).toEqual('password');
        expect(password.attr('id')).toEqual('okta-signin-password');
        const username = form.usernameField();

        expect(username.length).toBe(1);
        expect(username.attr('type')).toEqual('text');
        expect(username.attr('id')).toEqual('okta-signin-username');
        const signInButton = form.signInButton();

        expect(signInButton.length).toBe(1);
        expect(signInButton.attr('type')).toEqual('submit');
        expect(signInButton.attr('id')).toEqual('okta-signin-submit');
      });
    });

    it('calls introspect API on page load and handles error using authjs as client', function () {
      return setupIntrospect(errorResponse).then(function () {
        expect(window.history.pushState.calls.argsFor(0)[2]).toBe('/signin/refresh-auth-state/00stateToken');
        expect(signIn.authClient.tx.introspect).toHaveBeenCalledWith({ stateToken: '00stateToken' });
        expect(form.isPrimaryAuth()).toBe(true);
        const password = form.passwordField();

        expect(password.length).toBe(1);
        expect(password.attr('type')).toEqual('password');
        expect(password.attr('id')).toEqual('okta-signin-password');
        const username = form.usernameField();

        expect(username.length).toBe(1);
        expect(username.attr('type')).toEqual('text');
        expect(username.attr('id')).toEqual('okta-signin-username');
        const signInButton = form.signInButton();

        expect(signInButton.length).toBe(1);
        expect(signInButton.attr('type')).toEqual('submit');
        expect(signInButton.attr('id')).toEqual('okta-signin-submit');
        Q.resetUnhandledRejections();
      });
    });
  });
});

Expect.describe('OktaSignIn v2 bootstrap', function () {
  let signIn;

  beforeEach(function () {
    spyOn(Logger, 'error');
  });

  afterEach(function () {
    signIn.remove();
  });

  function setupLoginFlow (widgetOptions, responses) {
    signIn = new Widget(
      Object.assign(
        {
          baseUrl: url,
          apiVersion: '1.0.0',
          features: {
            router: true,
          },
        },
        widgetOptions || {}
      )
    );
    spyOn(signIn.authClient.token, 'prepareTokenParams').and.returnValue(Promise.resolve({
      codeVerifier: 'fakecodeVerifier',
      codeChallenge: 'fakecodeChallenge',
      codeChallengeMethod: 'fakecodeChallengeMethod'
    }));
    MockUtil.mockAjax(responses);

    // Add customize parser for ION request
    jasmine.Ajax.addCustomParamParser({
      test: function (xhr) {
        return xhr.contentType().indexOf('application/ion+json;') >= 0;
      },
      parse: function jsonParser (paramString) {
        return JSON.parse(paramString);
      },
    });
    return signIn.renderEl({ el: $sandbox });
  }

  function setupProxyIdxResponse (options) {
    signIn = new Widget(
      Object.assign(
        {
          baseUrl: url,
          proxyIdxResponse: {
            deviceEnrollment: {
              type: 'object',
              value: {
                name: options.enrollmentType,
                platform: 'IOS',
                enrollmentLink: 'https://sampleEnrollmentlink.com',
                vendor: 'Airwatch',
                signInUrl: 'https://idx.okta1.com'
              }
            }
          }
        },
        options || {}
      )
    );
    return signIn.renderEl({ el: $sandbox });
  }

  Expect.describe('Introspects token and loads Identifier view for new pipeline', function () {
    itp('calls introspect API on page load using idx-js as client', function () {
      const form = new IdentifierForm($sandbox);
      setupLoginFlow({ stateToken: '02stateToken' }, idxResponse);

      return Expect.wait(() => {
        return $('.siw-main-body').length === 1;
      }).then(function () {
        expect(form.getTitle()).toBe('Sign In');
        expect(form.getIdentifierInput().length).toBe(1);
        expect(form.getIdentifierInput().attr('name')).toBe('identifier');
        expect(form.getFormSaveButton().attr('value')).toBe('Next');

        expect(jasmine.Ajax.requests.count()).toBe(1);
        const firstReq = jasmine.Ajax.requests.first();

        expect(firstReq.data()).toEqual({ stateToken: '02stateToken' });
        expect(firstReq.method).toBe('POST');
        expect(firstReq.url).toBe('https://foo.com/idp/idx/introspect');
      });
    });

    itp('throws an error if invalid version is passed to idx-js', function () {
      return setupLoginFlow({
        stateToken: '02stateToken',
        apiVersion: '2.0.0'
      }, idxResponse).catch(err => {
        expect(err.name).toBe('CONFIG_ERROR');
        expect(err.message.toString()).toEqual('Error: Unknown api version: 2.0.0.  Use an exact semver version.');
      });
    });
  });

  Expect.describe('Interaction code flow', function () {
    let responses;
    beforeEach(function () {
      responses = [
        {
          state: 200,
          responseType: 'json',
          response: {
            'interaction_handle': 'fake_interaction_handle'
          },
        },
        idxResponse
      ];
    });

    itp('calls interact API on page load using idx-js as client in custom hosted widget', function () {
      const form = new IdentifierForm($sandbox);
      setupLoginFlow({ 
        clientId: 'someClientId',
        redirectUri: 'http://0.0.0.0:9999',
        useInteractionCodeFlow: true
      }, responses);

      return Expect.wait(() => {
        return $('.siw-main-body').length === 1;
      }).then(function () {
        expect(form.getTitle()).toBe('Sign In');
        expect(form.getIdentifierInput().length).toBe(1);
        expect(form.getIdentifierInput().attr('name')).toBe('identifier');
        expect(form.getFormSaveButton().attr('value')).toBe('Next');

        expect(jasmine.Ajax.requests.count()).toBe(2);
        const firstReq = jasmine.Ajax.requests.at(0);
        const secondReq = jasmine.Ajax.requests.at(1);

        expect(firstReq.method).toBe('POST');
        expect(firstReq.url).toBe('https://foo.com/oauth2/default/v1/interact');
        expect(secondReq.method).toBe('POST');
        expect(secondReq.url).toBe('https://foo.com/idp/idx/introspect');
      });
    });

    itp('throws an error if invalid version is passed to idx-js', function () {
      return setupLoginFlow({
        apiVersion: '2.0.0',
        clientId: 'someClientId',
        redirectUri: 'http://0.0.0.0:9999',
        useInteractionCodeFlow: true
      }, responses).catch(err => {
        expect(err.name).toBe('CONFIG_ERROR');
        expect(err.message.toString()).toEqual('Error: Unknown api version: 2.0.0.  Use an exact semver version.');
      });
    });

    describe('shows error when IDENTITY_ENGINE feature is not enabled', () => {
      itp('shows translated error when i18n is available', () => {
        const view = new TerminalView($sandbox);
        const testStr = 'This is a test string';
        setupLoginFlow({
          clientId: 'someClientId',
          redirectUri: 'http://0.0.0.0:9999',
          useInteractionCodeFlow: true,
          language: 'en',
          i18n: {
            en: {
              'oie.feature.disabled': testStr
            }
          }
        }, [
          errorFeatureNotEnabled
        ]);
  
        return Expect.wait(() => {
          return $('.siw-main-view.terminal').length === 1;
        }).then(function () {
          expect(view.getErrorMessages()).toBe(testStr);
        });
      });
      itp('shows untranslated error when i18n is not available', () => {
        const view = new TerminalView($sandbox);
        const testStr = 'The requested feature is not enabled in this environment.';
        setupLoginFlow({
          clientId: 'someClientId',
          redirectUri: 'http://0.0.0.0:9999',
          useInteractionCodeFlow: true,
        }, [
          errorFeatureNotEnabled
        ]);
  
        return Expect.wait(() => {
          return $('.siw-main-view.terminal').length === 1;
        }).then(function () {
          expect(view.getErrorMessages()).toBe(testStr);
        });
      });
    });

  });

  itp('Gets proxyIdxResponse and render terminal view', function () {
    setupProxyIdxResponse({ enrollmentType : 'mdm'});

    return Expect.wait(() => {
      return $('.siw-main-body').length === 1;
    });
  });
});