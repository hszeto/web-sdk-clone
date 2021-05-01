import chai, { expect } from 'chai';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Cookie } from '../src/storage';
import { ERROR } from '../src/constants';
import Gimbal from '../src/index';
import Navigator from '../src/navigator';
import OTW_Client from '../src/api/otw-client';

chai.use(sinonChai);

describe('Gimbal', () => {
  describe('setHostName', () => {
    context('when hostname is present', () => {
      beforeEach(() => {
        sinon.stub(Cookie, 'set');

        Gimbal.setHostName('www.client-proxy.com');
      });

      afterEach(() => {
        Cookie.set.restore();
      });

      it('should call `Cookie.set()`', () => {
        expect(Cookie.set).to.have.been
          .calledWith('gimbal-sdk-host', 'www.client-proxy.com');
      });
    })

    context('when hostname is missing', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');

        Gimbal.setHostName();
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should console log an error message', () => {
        expect(console.error)
          .to.have.been.calledWith(ERROR.HOST_NAME);
      });
    });

    context('when hostname is invalid', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');

        Gimbal.setHostName(123);
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should console log an error message', () => {
        expect(console.error)
          .to.have.been.calledWith(ERROR.HOST_NAME);
      });
    });
  });

  describe('getLocation', () => {
    context('when success', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-sdk-host=www.client-proxy.com'
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
        Gimbal.getLocation((err, position) => {
          expect(position).to.eql({
            latitude: 12.345,
            longitude: 23.45,
            accuracy: 22
          });

          done();
        });
      });
    });

    context('when the hostname is missing', () => {
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

      it('should return an error', (done) => {
        Gimbal.getLocation((err, _) => {
          expect(err).to.eql({ message: ERROR.HOST_NAME });

          done();
        });
      });
    });

    context('when the Navigator fails', () => {
      beforeEach(() => {
        global.document = {
          cookie: 'gimbal-sdk-host=www.client-proxy.com'
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

      it('should return an error', (done) => {
        Gimbal.getLocation((err, _) => {
          expect(err).to.eql({ message: ERROR.GET_CURRENT_POSITION });

          done();
        });
      });
    });
  });

  // describe('didUserArrive', () => {
  //   let stubNavigator;
  //   let stubOtwClient;

  //   context('when the Gimbal Public Key is missing', () => {
  //     beforeEach(() => {
  //       global.document = {
  //         cookie: ''
  //       };
  //     });

  //     afterEach(() => {
  //       global.document = {
  //         cookie: undefined
  //       };
  //     });

  //     it('should return an error', (done) => {
  //       Gimbal.getLocation((err, _) => {
  //         expect(err).to.eql({ message: ERROR.PUBLIC_KEY });

  //         done();
  //       });
  //     });
  //   });

  //   context('when the location is specified', () => {
  //     beforeEach(() => {
  //       global.document = {
  //         cookie: 'gimbal-public-key=GimbalTestPublicKey-123'
  //       };

  //       stubNavigator = sinon.spy(Navigator, 'getPosition');
  //     });

  //     afterEach(() => {
  //       global.document = {
  //         cookie: undefined
  //       };

  //       Navigator.getPosition.restore();

  //       stubOtwClient.restore();
  //     });

  //     context('when arrived', () => {
  //       it('should return true', (done) => {
  //         stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //           .resolves(true);

  //         Gimbal.didUserArrive({latitude: 888, longitude: 999}, (err, result) => {
  //           expect(stubNavigator).to.have.not.been.called;
  //           expect(result).to.be.true;

  //           done();
  //         })
  //       });
  //     });

  //     context('when not arrived', () => {
  //       it('should return false', (done) => {
  //         stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //           .resolves(false);

  //         Gimbal.didUserArrive({latitude: 888, longitude: 999}, (err, result) => {
  //           expect(stubNavigator).to.have.not.been.called;
  //           expect(result).to.be.false;

  //           done();
  //         });
  //       });
  //     });

  //     context('when error', () => {
  //       it('should return an error', (done) => {
  //         stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //           .rejects({ message: ERROR.SERVER });

  //         Gimbal.didUserArrive({latitude: 888, longitude: 999}, (err, result) => {
  //           expect(err).to.eql({ message: ERROR.SERVER });

  //           done();
  //         });

  //       });
  //     });
  //   })

  //   context('when the location is not specified', () => {
  //     beforeEach(() => {
  //       global.document = {
  //         cookie: 'gimbal-public-key=GimbalTestPublicKey-123'
  //       };
  //     });

  //     afterEach(() => {
  //       global.document = {
  //         cookie: undefined
  //       };
  //     });

  //     context('when getPosition success', () => {
  //       beforeEach(() => {
  //         stubNavigator = sinon.stub(Navigator, 'getPosition')
  //           .resolves({
  //             latitude: 12.345,
  //             longitude: 23.45,
  //             accuracy: 22
  //           });
  //       });

  //       afterEach(() => {
  //         Navigator.getPosition.restore();

  //         stubOtwClient.restore();
  //       });

  //       context('when arrived', () => {
  //         it('should return true', (done) => {
  //           stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //             .resolves(true);

  //           Gimbal.didUserArrive((err, result) => {
  //             expect(stubNavigator).to.have.been.called;
  //             expect(result).to.be.true;

  //             done();
  //           })
  //         });
  //       });

  //       context('when not arrived', () => {
  //         it('should return false', (done) => {
  //           stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //             .resolves(false);

  //           Gimbal.didUserArrive((err, result) => {
  //             expect(stubNavigator).to.have.been.called;
  //             expect(result).to.be.false;

  //             done();
  //           });
  //         });
  //       });

  //       context('when error', () => {
  //         it('should return an error', (done) => {
  //           stubOtwClient = sinon.stub(OTW_Client, 'didArrive')
  //             .rejects({ message: ERROR.SERVER });

  //           Gimbal.didUserArrive((err, result) => {
  //             expect(err).to.eql({ message: ERROR.SERVER });

  //             done();
  //           });
  //         });
  //       });
  //     });

  //     context('when getPosition fail', () => {
  //       beforeEach(() => {
  //         sinon.stub(Navigator, 'getPosition')
  //           .rejects({ message: ERROR.GET_CURRENT_POSITION });
  //       });

  //       afterEach(() => {
  //         Navigator.getPosition.restore();
  //       });

  //       it('should return an error', (done) => {
  //         Gimbal.didUserArrive((err, result) => {
  //           expect(err).to.eql({ message: ERROR.GET_CURRENT_POSITION });

  //           done();
  //         });
  //       });
  //     });
  //   })
  // });
});
