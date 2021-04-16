import { ERROR }  from './constants';

const Navigator = {
  getPosition: function() {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return reject({ message: ERROR.PLATFORM });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position || !position.coords) {
            return reject({ message: ERROR.POSITION });
          }

          const { latitude, longitude, accuracy } = position.coords;

          return resolve({ latitude, longitude, accuracy });
        },
        (err) => {
          if (err && err.code && err.code === 1) {
            return reject({ message: ERROR.PERMISSION });
          }

          return reject({ message: ERROR.GET_CURRENT_POSITION });
        }
      );
    });
  },
  watchPosition: function(callback) {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return callback({ message: ERROR.PLATFORM }, {});
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        if (!position || !position.coords) {
          return callback({ message: ERROR.POSITION }, {});
        }

        const { latitude, longitude, accuracy } = position.coords;

        return callback(null, { latitude, longitude, accuracy });
      },
      (err) => {
        if (err && err.code && err.code === 1) {
          return callback({ message: ERROR.PERMISSION }, {});
        }

        return callback({ message: ERROR.GET_CURRENT_POSITION }, {});
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        // maximumAge: 15000,
        // timeout: 20000,
      }
    );
  },
  clearWatchLocation: function(id) {
    navigator.geolocation.clearWatch(id);
    console.log('SDK: Cleared Watch Location ID: ', id);
  }
};

export default Navigator;


// // maximumAge: 0,
// timeout: 15000,
