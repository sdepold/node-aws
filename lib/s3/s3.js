var aws             = exports,
    S3Interface     = require("./s3_interface").S3Interface

aws.S3 = function(key, secret, options) {
  if (key == undefined || secret == undefined)
    throw("No key or secret passed!")
    
  this.s3Interface = new S3Interface(key, secret, options)
}

aws.S3.prototype.bucket = function(bucketName, options) {
  if(bucketName == undefined)
    throw("No bucket name passed!")
  else
    options.bucketName = bucketName
  
  // don't load keys when requesting a bucket
  options.restOptions = { "max-keys": 0 }
    
  this.s3Interface.requestBuckets(options)
}

aws.S3.prototype.buckets = function(options) {
  this.s3Interface.requestBuckets(options)
}

aws.S3.prototype.toString = function() {
  return "Key: " + this.key + ", Secret: " + this.secret
}

aws.S3.Bucket = require("./bucket").Bucket