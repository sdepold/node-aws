describe("S3", function(){
  describe("constructor", function() {
    it("should not be possible to instanciate S3 without key and secret", function(){
      try {
        new aws.S3()
      } catch(e) {
        expect(e).toMatch(/.*key.*secret.*/)
      }
    })

    it("should create a new S3 object if params are passed", function() {
      expect(new aws.S3(credentials.S3.key, credentials.S3.secret)).toBeAnInstanceOf(aws.S3)
    })
  })
  
  describe("s3Interface", function() {
    it('should have a s3Interface', function() {
      var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
      expect(s3.s3Interface.key).toBeDefined()
      expect(s3.s3Interface.secret).toBeDefined()
    })
  })
})

describe("Bucket", function() {
  describe("create", function() {
    it("should be possible to create a bucket", function() {
      var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
      var bucketName = "node-aws-test-bucket"

      aws.S3.Bucket.create(s3, bucketName, function(bucket) {
        expect(bucket.bucketName).toEqual(bucketName)
      })
    })
  })
  
  describe("get", function() {
    it("should be possible to get a bucket", function() {
      var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
      var bucketName = "node-aws-test-bucket"

      s3.bucket(bucketName, { callback: function(bucket) {
        expect(bucket.bucketName).toEqual(bucketName)
      }})
    })
  })
})