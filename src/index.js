import { Cookie } from './storage';
import Navigator  from './navigator';

class Gimbal {
  static setApiKey(publicKey) {
    if (!publicKey || typeof publicKey !== 'string') {
      console.error('Gimbal Public Key Required.');
      return;
    }

    Cookie.set('gimbal-public-key', publicKey);
  }

  static start(callback=() => {}) {
    if (!Cookie.get('gimbal-public-key')) {
      callback({ message: 'Gimbal Public Key Required.' }, {});
      return;
    }

    Navigator.getPosition()
      .then(({ latitude, longitude, accuracy }) => {
        callback(null, {
          latitude,
          longitude,
          accuracy,
        });
      })
      .catch(error => {
        callback(error, {});
      });
  }
};

export default Gimbal;
