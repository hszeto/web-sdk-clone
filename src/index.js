import { Cookie } from './storage';
import Navigator  from './navigator';

const Gimbal = {
  setApiKey: function(publicKey) {
    if (!publicKey || typeof publicKey !== 'string') {
      console.error('Gimbal Public Key Required.');
      return;
    }

    Cookie.set('gimbal-public-key', publicKey);
  },
  start: function(callback=() => {}) {
    if (!Cookie.get('gimbal-public-key')) {
      return callback({ message: 'Gimbal Public Key Required.' }, {});
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
  }
};

export default Gimbal;
