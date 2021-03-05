class Navigator {
  static getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator || !navigator.geolocation) {
        return reject({ message: 'Your platform is not supported.' });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position || !position.coords) {
            return reject({ message: 'Cannot find your position.' });
          }

          const { latitude, longitude, accuracy } = position.coords;

          return resolve({ latitude, longitude, accuracy });
        },
        (err) => {
          if (err && err.code && err.code === 1) {
            return reject({ message: 'Permission Denied!' });
          }

          return reject({ message: 'ERROR' });
        }
      );
    });
  }
}

export default Navigator;
