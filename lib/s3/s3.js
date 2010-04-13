var kiwi            = require("kiwi"),
    sha1            = require('../crypto/sha1')
    restler         = kiwi.require("restler"),
    http            = require("http"),
    sys             = require("sys"),
    S3Interface     = require("./s3_interface").S3Interface,
    aws             = exports
    

aws.S3 = function(key, secret, options) {
  this.s3Interface = new S3Interface(key, secret, options)
}

aws.S3.prototype.requestBucket = function(bucketName, options) {
  if(bucketName == undefined)
    throw new Exception("No bucket name passed!")
  
  this.s3Interface.getBucket(bucketName, options)
}

aws.S3.prototype.buckets = function() {
  this.s3Interface.getBucket(bucketName, options)
}

aws.S3.prototype.toString = function() {
  return "Key: " + this.key + ", Secret: " + this.secret
}