const zlib = require('zlib');

const AWS = require('aws-sdk');

class S3Wrapper {
  /**
     * Constructor for S3Wrapper
     * @param {*} logger
     */
  constructor(logger) {
    const self = this;
    self.logger = logger;
  }

  getPutErrorMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error putting object in the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getPutSuccessMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Successfully put object in the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getGetErrorMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error getting object from the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getGetSuccessMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Successfully got object from the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getDeleteErrorMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Error deleting object from the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getDeleteSuccessMessage(bucketName, region, key, correlationId) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    return `${correlationId}:Successfully deleted object from the ${bucketName} bucket within region ${region} with key of ${key}.`;
  }

  getS3Client(region) {
    // eslint-disable-next-line no-unused-vars
    const self = this;
    const s3 = new AWS.S3({ region });
    return s3;
  }

  putObjectAsync(options) {
    const self = this;
    let body = JSON.stringify(options.object);
    if (options.compress) {
      body = zlib.gzipSync(body);
    }
    return new Promise((resolve, reject) => {
      const params = {
        Body: body,
        Bucket: options.bucketName,
        Key: options.key,
      };
      const s3 = self.getS3Client(options.region);
      s3.putObject(params, (err, data) => {
        if (err) {
          self.logger.error(self.getPutErrorMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getPutSuccessMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ));
          resolve(data);
        }
      });
    });
  }

  getObjectAsync(options) {
    const self = this;
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: options.bucketName,
        Key: options.key,
      };
      const s3 = self.getS3Client(options.region);
      s3.getObject(params, (err, data) => {
        if (err) {
          self.logger.error(self.getGetErrorMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getGetSuccessMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ));
          let body = data.Body;
          if (options.compress) {
            body = zlib.gunzipSync(body);
            body = body.toString();
          }
          resolve(body);
        }
      });
    });
  }

  deleteObjectAsync(options) {
    const self = this;
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: options.bucketName,
        Key: options.key,
      };
      const s3 = self.getS3Client(options.region);
      s3.deleteObject(params, (err, data) => {
        if (err) {
          self.logger.error(self.getDeleteErrorMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ), JSON.stringify(err, null, 2));
          reject(err);
        } else {
          self.logger.debug(self.getDeleteSuccessMessage(
            options.bucketName,
            options.region, options.key, options.correlationId,
          ));
          resolve(data);
        }
      });
    });
  }
}

module.exports = S3Wrapper;
