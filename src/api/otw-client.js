import { ERROR, URL }  from '../constants';

const otwClient = (location, callback) => {
  return new Promise((resolve, reject) => {
    fetch(URL.OTW_API_URL)
      .then(response => response.json())
      .then(json => resolve(callback(null, json)) )
      .catch(error => reject(callback({message: ERROR.SERVER}, null)) )
  })
}

export { otwClient };
