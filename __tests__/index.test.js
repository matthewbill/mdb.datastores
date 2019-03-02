describe('exports', () => {
  test('exports work correctly', () => {

      const { DynamoWrapper, S3Wrapper, SqsWrapper } = require('../index.js');
      expect(DynamoWrapper).toBeDefined();
      expect(S3Wrapper).toBeDefined();
      expect(SqsWrapper).toBeDefined();
  });
});
