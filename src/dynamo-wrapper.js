/**
 * @copyright Matthew Bill
 */

/**
 * Class representing {insert description}.
 */
const AWS = require('aws-sdk');

class DynamoWrapper {
  /**
     * Constructor for DynamoWrapper
     * @param {*} logger
     */
  constructor(logger) {
    const self = this;
    self.logger = logger;
  }

  getQueryItemErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error querying item ${tableName} table.`;
  }

  getQueryItemSuccessMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Query item successful on ${tableName} table.`;
  }

  getQueryErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error querying ${tableName} table.`;
  }

  getQuerySuccessMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Query successful on ${tableName} table.`;
  }

  getQuerySuccessNoItemMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Query successful on ${tableName} table, but did not return an item.`;
  }

  getScanErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error scanning ${tableName} table.`;
  }

  getScanSuccessMessage(tableName, correlationId, itemCount) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Scan successful on ${tableName} table. Returned ${itemCount} items.`;
  }

  getScanSuccessNoItemsMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Scan successful on ${tableName} table, but no items were returned.`;
  }

  getAddErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error adding item to ${tableName} table.`;
  }

  getAddSuccessMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Item added successful to ${tableName} table.`;
  }

  getUpdateErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error updating item on ${tableName} table.`;
  }

  getUpdateSuccessMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Item updated successful on ${tableName} table.`;
  }

  getDeleteErrorMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error deleting item on ${tableName} table.`;
  }

  getDeleteSuccessMessage(tableName, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Item deleted successful on ${tableName} table.`;
  }

  getDocumentClient(region) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    const dynamoDB = new AWS.DynamoDB({ region });
    const docClient = new AWS.DynamoDB.DocumentClient(null, dynamoDB);
    return docClient;
  }

  queryItemAsync(tableName, region, params, correlationId) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.queryAsync(tableName, region, params, correlationId).then((data) => {
        if (data.Items.length > 0) {
          self.logger.debug(self.getQueryItemSuccessMessage(
            tableName, correlationId,
          ));
          resolve(data.Items[0]);
        } else {
          self.logger.debug(self.getQuerySuccessNoItemMessage(
            tableName, correlationId,
          ));
          resolve(null);
        }
      }).catch((err) => {
        self.logger.error(self.getQueryItemErrorMessage(
          tableName, correlationId,
        ), JSON.stringify(err, null, 2));
        reject(err);
      });
    });
  }

  queryAsync(tableName, region, params, correlationId) {
    const self = this;
    const docClient = self.getDocumentClient(region);
    return new Promise((resolve, reject) => {
      docClient.query(params, (err, data) => {
        if (err) {
          self.logger.error(self.getQueryErrorMessage(
            tableName, correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getQuerySuccessMessage(
            tableName, correlationId,
          ));
          resolve(data);
        }
      });
    });
  }

  scanAsync(tableName, region, params, correlationId) {
    const self = this;
    const docClient = self.getDocumentClient(region);
    return new Promise((resolve, reject) => {
      docClient.scan(params, (err, data) => {
        if (err) {
          self.logger.error(self.getScanErrorMessage(
            tableName, correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getScanSuccessMessage(
            tableName, correlationId, data.Items.length,
          ));
          resolve(data);
        }
      });
    });
  }

  putAsync(tableName, region, params, correlationId) {
    const self = this;
    const docClient = self.getDocumentClient(region);
    return new Promise((resolve, reject) => {
      docClient.put(params, (err) => {
        if (err) {
          self.logger.error(self.getAddErrorMessage(
            tableName, correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getAddSuccessMessage(
            tableName, correlationId,
          ));
          resolve();
        }
      });
    });
  }

  updateAsync(tableName, region, params, correlationId) {
    const self = this;
    const docClient = self.getDocumentClient(region);
    return new Promise((resolve, reject) => {
      docClient.update(params, (err) => {
        if (err) {
          self.logger.error(self.getUpdateErrorMessage(
            tableName, correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getUpdateSuccessMessage(
            tableName, correlationId,
          ));
          resolve();
        }
      });
    });
  }

  deleteAsync(tableName, region, params, correlationId) {
    const self = this;
    const docClient = self.getDocumentClient(region);
    return new Promise((resolve, reject) => {
      docClient.delete(params, (err) => {
        if (err) {
          self.logger.error(self.getDeleteErrorMessage(
            tableName, correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getDeleteSuccessMessage(
            tableName, correlationId,
          ));
          resolve();
        }
      });
    });
  }
}
module.exports = DynamoWrapper;
