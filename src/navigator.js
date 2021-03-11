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
  }
};

export default Navigator;
