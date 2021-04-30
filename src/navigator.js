import { ERROR }  from './constants';
import { hasArrived } from './helpers/arrival';
import Logs_Client from './api/logs-client';

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
  track: function(callback) {
    const tmpGeofence = [
      [34.11392514038074,  -118.06329412159427],
      [34.114062266352775, -118.06331893202777],
      [34.114014522112434, -118.06341079768688],
      [34.11392791621236,  -118.06338866946244],
    ];

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return callback({ message: ERROR.PLATFORM }, {});
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        if (!position || !position.coords) {
          return callback({ message: ERROR.POSITION }, {});
        }

        const { latitude, longitude, accuracy } = position.coords;

        if (hasArrived([latitude, longitude], tmpGeofence)) {
          return callback(null, { latitude, longitude, accuracy, state: 'detectedArrival' });
        } else {
          return callback(null, { latitude, longitude, accuracy, state: 'onTheWay' });
        }
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
      }
    );
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

        /*
        `position.coors` returns:
        GeolocationCoordinates { latitude: 34.11382998852447, longitude: -118.06301682293301, altitude: 132.4998779296875, accuracy: 65, altitudeAccuracy: 10, heading: null, speed: null }
        */

        const { latitude, longitude, accuracy } = position.coords;

        Logs_Client.create({ latitude, longitude, accuracy, time: new Date().toISOString() });

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
