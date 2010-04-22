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

process.mixin(exports.S3Interface.prototype, {
  sign: function(stringToSign) {
    // Signature = Base64( HMAC-SHA1( YourSecretAccessKeyID, UTF-8-Encoding-Of( StringToSign ) ) );
    return require('../vendor/crypto/sha1').b64_hmac_sha1(this.secret, stringToSign)
  },
  generateSignature: function(options) {
    var stringToSign = [
      (options.httpMethod || "get").toUpperCase(),
      options.contentMD5 || "",
      options.contentType || "",
      options.date || new Date().toUTCString(),
      ((options.canonicalizedAmzHeaders || "") + (options.canonicalizedResource || ""))
    ].join("\n")

    return this.sign(stringToSign)
  },
  generateAuthorizationString: function(signature) {
    return "AWS " + this.key + ":" + signature
  },
  sendBucketRequest: function(url, resource, options) {
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
  },
  requestBuckets: function(options) {
    options = { create: false, perms: null, headers: null, callback: function(){}, restOptions: {} }.merge(options)
    var url = "http://" + (options.bucketName ? (options.bucketName + ".") : "") + this.config.host
    var resource = "/" + (options.bucketName ? (options.bucketName + "/") : "")
    var _this = this

    // overwrite callback method in order to generate <S3.Bucket>s from the result list
    var _callback = options.callback
    options.callback = function(result) {
      var callbackResult = null

      if (options.bucketName) {
        var meta = result.listbucketresult.reject(function(value, key) { return key == "name"})
        callbackResult = new S3.Bucket(result.listbucketresult.name, meta, _this)
      } else {
        callbackResult = result.listallmybucketsresult.buckets.bucket.map(function(bucketEntry) {
          var meta = bucketEntry.reject(function(value, key) { return key == "name"})
          return new S3.Bucket(bucketEntry.name, meta, _this)
        })
      }

      _callback(callbackResult)
    }

    this.sendBucketRequest(url, resource, options)
  }
})