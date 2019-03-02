/**
 * @copyright Matthew Bill
*/

const DynamoWrapper = require('./src/dynamo-wrapper.js');
const S3Wrapper = require('./src/s3-wrapper.js');
const SqsWrapper = require('./src/sqs-wrapper.js');

module.exports = {
  DynamoWrapper,
  S3Wrapper,
  SqsWrapper,
};
