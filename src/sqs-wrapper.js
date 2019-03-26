
const AWS = require('aws-sdk');

/**
 * Class representing a wapper for AWS SQS.
 * @class SqsWrapper
 */
class SqsWrapper {
  /**
   * Constructor for SqsWrapper
   * @param {string} options.region The AWS region.
   * @param {Logger} options.logger The logger.
   */
  constructor(options) {
    const self = this;
    self.logger = options.logger;
    self.sqs = new AWS.SQS({ region: options.region });
  }

  /**
   * Sends a message to SQS
   * @param {string} options.messageBody The message to send.
   * @param {string} options.queueUrl The SQS queue url.
   * @returns {Promise} Promise to send a mesage to SQS.
   * @memberof SqsWrapper
   */
  sendMessage(options) {
    const self = this;
    return new Promise((resolve, reject) => {
      const params = {
        MessageBody: options.messageBody,
        QueueUrl: options.queueUrl,
        DelaySeconds: 0,
      };
      self.sqs.sendMessage(params, (err, data) => {
        if (err) {
          self.logger.error(err, err.stack);
          reject(err);
        }
        resolve(data);
      });
    });
  }

  /**
   * Receives a message from SQS.
   * @param {string} options.queueUrl The SQS queue url.
   * @returns {Promise} Promise to receieve a mesage from SQS.
   * @memberof SqsWrapper
   */
  receiveMessage(options) {
    const self = this;
    return new Promise((resolve, reject) => {
      const params = {
        QueueUrl: options.queueUrl,
        WaitTimeSeconds: 20,
      };
      self.sqs.receiveMessage(params, (err, data) => {
        if (err) {
          self.logger.error(err, err.stack);
          reject(err);
        }
        resolve(data);
      });
    });
  }
}

module.exports = SqsWrapper;
