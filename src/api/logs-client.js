import { ERROR, URL }  from '../constants';

const create = (locations) => {
  console.log("PUT batch to logger...");
  console.log(JSON.stringify(locations));

  return new Promise((resolve, reject) => {
    fetch(`${URL.WEB_SDK_PROXY_URL}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(locations)
    })
      .then(response => {
        console.log(response);

        if (response.status !== 200) {
          throw ERROR.SERVER;
        }

        return;
      })
      .then(json => resolve(json))
      .catch(error => reject({ message: ERROR.SERVER }));
  });
};

export default { create };
