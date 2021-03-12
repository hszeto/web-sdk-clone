import chai, { expect } from 'chai';
import fetchMock from 'fetch-mock';
import sinonChai from 'sinon-chai';

import { ERROR } from '../../src/constants';
import { otwClient } from '../../src/api/otw-client';

chai.use(sinonChai);

const mockLatLong = {
  latitude: 111,
  longitude: 222
}

describe('OTW-Client', () => {
  context('when success', () => {
    beforeEach(() => {
      fetchMock.mock('https://www.gimbal.com', true);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return true', (done) => {
      otwClient(mockLatLong, (err, result) => {
        expect(result).to.be.true;

        done();
      });
    });
  });

  context('when fail', () => {
    beforeEach(() => {
      fetchMock.mock('https://www.gimbal.com', 500);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return an error', (done) => {
      otwClient(mockLatLong, (err, result) => {
        expect(err).to.eql({ message: ERROR.SERVER });

        done();
      });
    });
  });
});
