import Logs_Client from './api/logs-client';

let batch = [];

const Logger = {
  run: function(data) {
    batch.push(data);

    if (batch.length > 10) {
      Logs_Client.create(batch);

      batch = [];
    }
  }
};

export default Logger;
