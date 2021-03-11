import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Cookie } from '../src/storage';
import { ERROR } from '../src/constants';
import Gimbal from '../src/index';
import Navigator from '../src/navigator';

chai.use(sinonChai);

describe('Gimbal', () => {
  describe('setApiKey', () => {
    context('when public key is present', () => {
      beforeEach(() => {
        sinon.stub(Cookie, 'set');

        Gimbal.setApiKey('GimbalTestPublicKey-abc-123');
      });

      afterEach(() => {
        Cookie.set.restore();
      });

      it('should call `Cookie.set()`', () => {
        expect(Cookie.set).to.have.been
          .calledWith('gimbal-public-key', 'GimbalTestPublicKey-abc-123');
      });
    })

    context('when public key is missing', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');

        Gimbal.setApiKey();
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should return an error message', () => {
        expect(console.error)
          .to.have.been.calledWith(ERROR.PUBLIC_KEY);
      });
    });

    context('when public key is invalid', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');

        Gimbal.setApiKey(123);
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should return an error message', () => {
        expect(console.error)
          .to.have.been.calledWith(ERROR.PUBLIC_KEY);
      });
    });
  });

  describe('start', () => {
    context('when success', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-public-key=GimbalTestPublicKey-123'
        };

        sinon.stub(Navigator, 'getPosition')
          .resolves({
            latitude: 12.345,
            longitude: 23.45,
            accuracy: 22
          });
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };

        Navigator.getPosition.restore();
      });

      it('should return latitude, longitude, and accuracy', (done) => {
        Gimbal.start((err, position) => {
          expect(position).to.eql({
            latitude: 12.345,
            longitude: 23.45,
            accuracy: 22
          });

          done();
        });
      });
    });

    context('when the Gimbal Public Key is missing', () => {
      beforeEach(() => {
        global.document = {
          cookie: ''
        };
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };
      });

      it('should return an error message', (done) => {
        Gimbal.start((err, _) => {
          expect(err).to.eql({ message: ERROR.PUBLIC_KEY });

          done();
        });
      });
    });

    context('when the Navigator fails', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-public-key=GimbalTestPublicKey-123'
        };

        sinon.stub(Navigator, 'getPosition')
          .rejects({ message: ERROR.GET_CURRENT_POSITION })
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };

        Navigator.getPosition.restore();
      });

      it('should return an error message', (done) => {
        Gimbal.start((err, _) => {
          expect(err).to.eql({ message: ERROR.GET_CURRENT_POSITION });

          done();
        });
      });
    });
  });
});
