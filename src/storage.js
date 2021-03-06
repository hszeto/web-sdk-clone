const Cookie = {
  get: function(key) {
    if (typeof key !== 'string') {
      return;
    }

    return document.cookie.split(';').find((c) => {
      let [k, v] = c.split('=');

      return !!(k === key && v && v.length > 0)
    });
  },
  set: function(key, value) {
    if (typeof value !== 'string' || !document || document.cookie === undefined) {
      return;
    }

    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    const expires = `expires=${date.toGMTString()}`;
    document.cookie = `${key}=${value};path=/;${expires}`;
  }
};

export { Cookie };
