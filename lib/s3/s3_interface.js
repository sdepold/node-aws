var kiwi    = require("kiwi"),
    sha1    = require('../crypto/sha1')
    restler = kiwi.require("restler"),
    http    = require("http"),
    sys     = require("sys"),
    aws     = exports
    
    kiwi.require("ext")

aws.S3Interface = function(key, secret, options) {
  this.key = key
  this.secret = secret
  this.config = {
    userAgent: "node-aws",
    host: "s3.amazonaws.com"
  }
}

aws.S3Interface.prototype.sign = function(stringToSign) {
  // Signature = Base64( HMAC-SHA1( YourSecretAccessKeyID, UTF-8-Encoding-Of( StringToSign ) ) );

  return sha1.b64_hmac_sha1(this.secret, stringToSign)
}

aws.S3Interface.prototype.generateSignature = function(options) {
  var stringToSign = [
    (options.httpMethod || "get").toUpperCase(),
    options.contentMD5 || "",
    options.contentType || "",
    options.date || new Date().toUTCString(),
    ((options.canonicalizedAmzHeaders || "") + (options.canonicalizedResource || ""))
  ].join("\n")

  return this.sign(stringToSign)
}

aws.S3Interface.prototype.generateAuthorizationString = function(signature) {
  return "AWS " + this.key + ":" + signature
}

aws.S3Interface.prototype.getBucket = function(bucketName, options) {
  var url = "http://" + bucketName + "." + this.config.host
  var date = new Date().toUTCString()
  var signature = this.generateSignature({ date: date, canonicalizedResource: "/" + bucketName + "/" })
  
  var rest_options = {
    headers: {
      'Content-Type': "",
      'Date': date,
      'User-Agent': this.config.userAgent,
      'Authorization': this.generateAuthorizationString(signature)
    },
    body: {}
  }
  
  restler.get(url, rest_options).addListener('complete', function(result) {
    options.onComplete(result.listbucketresult.contents)
  })
}

aws.S3Interface.prototype.getBuckets = function(options) {
  var url = 'http://' + this.config.host
  var date = new Date().toUTCString()
  var signature = this.generateSignature({ date: date, canonicalizedResource: "/" })

  var rest_options = {
    headers: {
      'Content-Type': "",
      'Date': date,
      'User-Agent': this.config.userAgent,
      'Authorization': this.generateAuthorizationString(signature)
    },
    body: {}
  }
  
  restler.get(url, rest_options).addListener('complete', function(result) {
    options.onComplete(result.listallmybucketsresult.buckets)
  })
}