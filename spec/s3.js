describe("S3", function(){
  describe("constructor", function() {
    it("should not be possible to instanciate S3 without key and secret", function(){
      var _this = this
      try {
        new aws.S3()
      } catch(e) {
        _this.expect(e).toMatch(/.*key.*secret.*/)
      }
    })

    it("should create a new S3 object if params are passed", function() {
      this.expect(new aws.S3(credentials.S3.key, credentials.S3.secret)).toBeAnInstanceOf(aws.S3)
    })
  })
  
  describe("s3Interface", function() {
    var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
    it('should have a s3Interface', function() {
      this.expect(s3.s3Interface.key).toBeDefined()
      this.expect(s3.s3Interface.secret).toBeDefined()
    })
  })
})

describe("Bucket", function() {
  describe("create", function() {
    var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
    
    it("should be possible to create a bucket", function() {
      var _this = this
      var bucketName = "node-aws-test-bucket"

      aws.S3.Bucket.create(s3, bucketName, function(bucket) {
        _this.expect(bucket.bucketName).toEqual(bucketName)
      })
    })
  })
  
  describe("get", function() {
    var s3 = new aws.S3(credentials.S3.key, credentials.S3.secret)
    
    it("should be possible to get a bucket", function() {
      var _this = this
      var bucketName = "node-aws-test-bucket"

      s3.bucket(bucketName, { callback: function(bucket) {
        _this.expect(bucket.bucketName).toEqual(bucketName)
      }})
    })
  })
})