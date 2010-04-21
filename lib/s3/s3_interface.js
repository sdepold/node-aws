var kiwi    = require("kiwi"),
    restler = require("../vendor/restler/restler"),
    sys     = require("sys"),
    S3      = require("./bucket")
    
    kiwi.require("ext")

exports.S3Interface = function(key, secret, options) {
  this.key = key
  this.secret = secret
  this.config = {
    userAgent: "node-aws",
    host: "s3.amazonaws.com"
  }
}

exports.S3Interface.prototype.sign = function(stringToSign) {
  // Signature = Base64( HMAC-SHA1( YourSecretAccessKeyID, UTF-8-Encoding-Of( StringToSign ) ) );

  return require('../vendor/crypto/sha1').b64_hmac_sha1(this.secret, stringToSign)
}

exports.S3Interface.prototype.generateSignature = function(options) {
  var stringToSign = [
    (options.httpMethod || "get").toUpperCase(),
    options.contentMD5 || "",
    options.contentType || "",
    options.date || new Date().toUTCString(),
    ((options.canonicalizedAmzHeaders || "") + (options.canonicalizedResource || ""))
  ].join("\n")

  return this.sign(stringToSign)
}

exports.S3Interface.prototype.generateAuthorizationString = function(signature) {
  return "AWS " + this.key + ":" + signature
}

exports.S3Interface.prototype.requestBucket = function(url, resource, options) {
  // add rest parameters to the url => ?max-keys=10&foo=bar
  url += "/?" + options.restOptions.map(function(value, key) { return key + "=" + value }).join("&")
  
  var date = new Date().toUTCString()
  var signature = this.generateSignature({ date: date, canonicalizedResource: resource })
  var restlerOptions = {
    headers: {
      'Content-Type': "",
      'Date': date,
      'User-Agent': this.config.userAgent,
      'Authorization': this.generateAuthorizationString(signature)
    },
    body: {}
  }

  restler.get(url, restlerOptions).addListener('complete', options.callback)
}

exports.S3Interface.prototype.bucket = function(bucketName, options) {
  options = { create: false, perms: null, headers: null, callback: function(){}, restOptions: {} }.merge(options)
  var url = "http://" + bucketName + "." + this.config.host
  var resource = "/" + bucketName + "/"

  // overwrite callback method in order to generate <S3.Bucket>s from the result list
  var _callback = options.callback
  options.callback = function(result) {
    var bucket = new S3.Bucket(result.listbucketresult)
    _callback(bucket)
  }
  
  this.requestBucket(url, resource, options)
}

exports.S3Interface.prototype.buckets = function(options) {
  options = { create: false, perms: null, headers: null, callback: function(){}, restOptions: {} }.merge(options)
  options.callback = function(result) {
    // var buckets = result.listallmybucketsresult.buckets.bucket.map(function(value){
    //       return new S3.Bucket(value)
    //     })
    //     sys.puts(sys.inspect(buckets))
  }
  
  var url = 'http://' + this.config.host
  var resource = "/"
  this.requestBucket(url, resource, options)
}