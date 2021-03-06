import { expect } from 'chai';
import sinon from 'sinon';

import { Cookie } from '../src/storage';

describe('Storage', () => {
  describe('getCookie', () => {
    context('when cookie is present', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-public-key=GimbalTestPublicKey-123'
        };
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };
      });

      it('should return the cookie', () => {
        expect(Cookie.get('gimbal-public-key'))
          .to.eql('gimbal-public-key=GimbalTestPublicKey-123')
      });
    });

    context('when cookie is not present', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-public-key='
        };
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };
      });

      it('should return undefined', () => {
        expect(Cookie.get('gimbal-public-key'))
          .to.eql(undefined)
      });
    });
  });

  describe('setCookie', () => {
    context('when document.cookie is defined', () => {
      let cookie, expires, path;

      beforeEach(() => {
        global.document = {
          cookie: sinon.spy()
        };

        Cookie.set('gimbal-test-public-key', 'GimbalTestPublicKey-abc-123');
        [cookie, path, expires] = global.document.cookie.split(';');
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };
      });

      it('should write to the browser cookie', () => {
        expect(cookie).to
          .equal('gimbal-test-public-key=GimbalTestPublicKey-abc-123');
      });

      it('should set the expiration date 1 year ahead', () => {
        const [_, cookieExpireDate] = expires.split('=');
        const cookieExpireYear = new Date(cookieExpireDate).getFullYear();
        const nextYear = new Date().getFullYear() + 1;

        expect(cookieExpireYear).to.equal(nextYear)
      });
    });

    context('when document.cookie is not defined', () => {
      beforeEach(() => {
        global.document = sinon.spy();
      });

      it('should not set cookie', () => {
        expect(Cookie.set('gimbal-test-public-key', 'GimbalTestPublicKey-abc-123'))
          .to.be.undefined;
      });
    });
  });
});
