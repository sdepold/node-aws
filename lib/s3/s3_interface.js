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
      [options.canonicalizedAmzHeaders || "", options.canonicalizedResource || ""].reject(function(value){return value == ""}).join("\n")
    ].join("\n")
    // sys.puts(stringToSign.replace(/\n/g, "\\n"))
    return this.sign(stringToSign)
  },
  
  generateAuthorizationString: function(signature) {
    return "AWS " + this.key + ":" + signature
  },
  
  addParamsToUrl: function(url, params) {
    var result = url
    if(!url.includes("?")) result += "?"
    
    return result + (params || {}).map(function(value, key) { return key + "=" + value }).join("&")
  },
  
  sendBucketRequest: function(url, resource, options) {
    url = this.addParamsToUrl(url + "/", options.restOptions)
    
    var date = new Date().toUTCString()
    var canonicalizedAmzHeaders = options.headers.map(function(value, key) {
      return key.toLowerCase() + ":" + value
    }).join("\n")
    // sys.puts(canonicalizedAmzHeaders.replace(/\n/g, "\\n"))
    var signature = this.generateSignature({ 
      date: date,
      canonicalizedAmzHeaders: canonicalizedAmzHeaders,
      canonicalizedResource: resource,
      httpMethod: options.httpMethod
    })
    var restlerOptions = {
      headers: {
        'Content-Type': "",
        'Date': date,
        'User-Agent': this.config.userAgent,
        'Authorization': this.generateAuthorizationString(signature)
      }.merge(options.headers || {}),
      body: {}
    }
    // sys.puts(sys.inspect(restlerOptions))
    if(!["get", "post", "put", "del"].includes(options.httpMethod)) throw("Unsupported httpMethod!")
    restler[options.httpMethod](url, restlerOptions).addListener('complete', options.callback)
  },
  
  requestBuckets: function(options) {
    options = { httpMethod: "get", headers: {}, callback: function(){}, restOptions: {} }.merge(options)
    
    var url = "http://" + (options.bucketName ? (options.bucketName + ".") : "") + this.config.host
    var resource = options.bucketName ? ("/" + options.bucketName + "/") : "/"
    var _this = this

    // overwrite callback method in order to generate <S3.Bucket>s from the result list
    var _callback = options.callback
    options.callback = function(result) {
      // sys.puts(sys.inspect(result))
      var callbackResult = null

      if (options.bucketName) {
        var meta = result.listbucketresult.reject(function(value, key) { return key == "name"})
        callbackResult = new S3.Bucket(_this, result.listbucketresult.name, meta)
      } else {
        callbackResult = result.listallmybucketsresult.buckets.bucket.map(function(bucketEntry) {
          var meta = bucketEntry.reject(function(value, key) { return key == "name"})
          return new S3.Bucket(_this, bucketEntry.name, meta)
        })
      }

      _callback(callbackResult)
    }

    this.sendBucketRequest(url, resource, options)
  },
  
  createBucket: function(bucketName, options) {
    options = { httpMethod: "put", headers: {}, callback: function(){}, restOptions: {} }.merge(options)
    
    var url = "http://" + bucketName + "." + this.config.host
    var resource = "/" + bucketName + "/"

    this.sendBucketRequest(url, resource, options)
  }
})