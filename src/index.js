import { Cookie } from './storage';
import { ERROR }  from './constants';
import Navigator  from './navigator';

import OTW_Client from './api/otw-client';

const Gimbal = {
  setApiKey: function(publicKey) {
    if (!publicKey || typeof publicKey !== 'string') {
      console.error(ERROR.PUBLIC_KEY);
      return;
    }

    Cookie.set('gimbal-public-key', publicKey);
  },
  start: function(callback=() => {}) {
    if (!Cookie.get('gimbal-public-key')) {
      return callback({ message: ERROR.PUBLIC_KEY }, {});
    }

    return Navigator.getPosition()
      .then(({ latitude, longitude, accuracy }) => {
        return callback(null, {
          latitude,
          longitude,
          accuracy,
        });
      })
      .catch(error => {
        return callback(error, {});
      });
  },
  didUserArrive: function(arg1, arg2=()=>{}) {
    if (!Cookie.get('gimbal-public-key')) {
      return callback({ message: ERROR.PUBLIC_KEY }, {});
    }

    let callback, location;

    if (typeof arg1 === 'object' && !!arg1.latitude && !!arg1.longitude) {
      callback = arg2;
      location = arg1;

      return OTW_Client.didArrive(location, callback)
        .then(response => callback(null, response))
        .catch(error => callback(error, {}));
    } else {
      callback = arg1;

      return Navigator.getPosition()
        .then(location => {
          return OTW_Client.didArrive(location, callback)
            .then(response => callback(null, response))
            .catch(error => callback(error, {}));
        })
        .catch(error => callback(error, {}) );
    }
  }
};

export default Gimbal;
