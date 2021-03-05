import { expect } from 'chai';

import Navigator from '../src/navigator';

describe('Navigator', () => {
  describe('getPosition', () => {
    describe('success', () => {
      beforeEach(() => {
        global.navigator = {
          geolocation: {
            getCurrentPosition: (position) => {
              position({
                coords: {
                  latitude: 12.345,
                  longitude: 67.89,
                  accuracy: 23
                }
              })
            }
          }
        };
      });

      afterEach(() => {
        global.navigator = undefined;
      });

      it('should return latitude, longitude, accuracy', () => {
        Navigator.getPosition()
          .then(({ latitude, longitude, accuracy }) => {
            expect(latitude).to.equal(12.345)
            expect(longitude).to.equal(67.89)
            expect(accuracy).to.equal(23)
          })
      });
    });

    describe('fail', () => {
      context('when the platform does not support navigator', () => {
        it('should return an error message', () => {
          Navigator.getPosition()
            .catch(error => {
              expect(error).to.equal({ message: 'Your platform is not supported.'});
            })
        });
      });

      context('when position not found', () => {
        beforeEach(() => {
          global.navigator = {
            geolocation: {
              getCurrentPosition: (position) => {
                position()
              }
            }
          };
        });

        afterEach(() => {
          global.navigator = undefined;
        });

        it('should return an error message', () => {
          Navigator.getPosition()
            .catch(error => {
              expect(error).to.equal({ message: 'Cannot find your position.'});
            })
        });
      });

      context('when permission denied', () => {
        beforeEach(() => {
          global.navigator = {
            geolocation: {
              getCurrentPosition: (_, error) => {
                error({
                  code: 1
                })
              }
            }
          };
        });

        afterEach(() => {
          global.navigator = undefined;
        });

        it('should return an error message', () => {
          Navigator.getPosition()
            .catch(error => {
              expect(error).to.equal({ message: 'Permission Denied!'});
            })
        });
      });

      context('when there is an error', () => {
        beforeEach(() => {
          global.navigator = {
            geolocation: {
              getCurrentPosition: (_, error) => {
                error({
                  code: 911
                })
              }
            }
          };
        });

        afterEach(() => {
          global.navigator = undefined;
        });

        it('should return an error message', () => {
          Navigator.getPosition()
            .catch(error => {
              expect(error).to.equal({ message: 'ERROR' });
            })
        });
      });
    });
  });
});
