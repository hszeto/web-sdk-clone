import { ERROR, URL }  from '../constants';

const didArrive = (location) => {
  return new Promise((resolve, reject) => {
    fetch(URL.OTW_API_URL)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject({ message: ERROR.SERVER }));
  });
};

export default { didArrive };
