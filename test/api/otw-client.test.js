import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import { ERROR } from '../../src/constants';
import OTW_Client from '../../src/api/otw-client';

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

    it('should return true', () =>
      OTW_Client.didArrive(mockLatLong)
        .then(result => expect(result).to.be.true)
    );
  });

  context('when fail', () => {
    beforeEach(() => {
      fetchMock.mock('https://www.gimbal.com', 500);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return an error', () =>
      OTW_Client.didArrive(mockLatLong)
        .catch(error => expect(error).to.be.eql({message: ERROR.SERVER}))
    );
  });
});
