import { Cookie } from './storage';
import { ERROR }  from './constants';
import Navigator  from './navigator';

// import OTW_Client from './api/otw-client';

const defaultCallback = () => {};

const Gimbal = {
  setHostName: function(host) {
    if (!host || typeof host !== 'string') {
      console.error(ERROR.HOST_NAME);
      return;
    }

    Cookie.set('gimbal-sdk-host', host);
  },
  // didUserArrive: function(arg1, arg2=defaultCallback) {
  //   if (!Cookie.get('gimbal-sdk-host')) {
  //     return callback({ message: ERROR.PUBLIC_KEY }, {});
  //   }

  //   let callback, location;

  //   if (typeof arg1 === 'object' && !!arg1.latitude && !!arg1.longitude) {
  //     callback = arg2;
  //     location = arg1;

  //     return OTW_Client.didArrive(location, callback)
  //       .then(response => callback(null, response))
  //       .catch(error => callback(error, {}));
  //   } else {
  //     callback = arg1;

  //     return Navigator.getPosition()
  //       .then(location => {
  //         return OTW_Client.didArrive(location, callback)
  //           .then(response => callback(null, response))
  //           .catch(error => callback(error, {}));
  //       })
  //       .catch(error => callback(error, {}) );
  //   }
  // },
  getLocation: function(callback=defaultCallback) {
    if (!Cookie.get('gimbal-sdk-host')) {
      return callback({ message: ERROR.HOST_NAME }, {});
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
  watchLocation: function(callback=defaultCallback) {
    if (!Cookie.get('gimbal-sdk-host')) {
      return callback({ message: ERROR.HOST_NAME }, {});
    }

    return Navigator.watchPosition(callback)
  },
  startMonitoring: function(callback=defaultCallback) {
    if (!Cookie.get('gimbal-sdk-host')) {
      return callback({ message: ERROR.HOST_NAME }, {});
    }

    return Navigator.track(callback);
  },
  clearWatchLocation: function(id) {
    Navigator.clearWatchLocation(id);
  }
};

export default Gimbal;
