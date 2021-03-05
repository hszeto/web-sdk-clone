import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Cookie } from '../src/storage';
import Gimbal from '../src/index';
import Navigator from '../src/navigator';

chai.use(sinonChai)

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
          .to.have.been.calledWith('Gimbal Public Key Required.');
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
          .to.have.been.calledWith('Gimbal Public Key Required.');
      });
    });
  });

  describe('start', () => {
    context('when success', () => {
      before(() => {
        global.document = {
          cookie: 'gimbal-public-key=GimbalPublicKey-123'
        };

        sinon.stub(Navigator, 'getPosition')
          .resolves(null, {
            latitude: 12.345,
            longitude: 23.45,
            accuracy: 22
          })
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };

        Navigator.getPosition.restore();
      });

      it('should return latitude, longitude, accuracy', () => {
        Gimbal.start((err, { latitude, longitude, accuracy }) => {
          expect(latitude).to.equal(12.345);
          expect(longitude).to.equal(23.45);
          expect(accuracy).to.equal(22);
        })
      });
    });

    context('when fail', () => {
      before(() => {
        global.document = {
          cookie: 'gimbal-public-key=GimbalPublicKey-123'
        };

        sinon.stub(Navigator, 'getPosition')
          .rejects({ message: 'ERROR' }, null)
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };

        Navigator.getPosition.restore();
      });

      it('should return an error message', () => {
        Gimbal.start((err, _) => {
          expect(err).to.equal({ message: 'ERROR' });
        })
      });
    });

    context('when the Gimbal Public Key is missing', () => {
      before(() => {
        global.document = {
          cookie: ''
        };
      });

      afterEach(() => {
        global.document = {
          cookie: undefined
        };
      });

      it('should return an error message', () => {
        Gimbal.start((err, _) => {
          expect(err).to.eql({ message: "Gimbal Public Key Required." });
        });
      });
    });
  });
});
