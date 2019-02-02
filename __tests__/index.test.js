describe('exports', () => {
  test('exports work correctly', () => {

      const { DynamoWrapper } = require('../index');
      expect(DynamoWrapper).toBeDefined();

      const { S3Wrapper } = require('../index');
      expect(S3Wrapper).toBeDefined();
      
  });
});
