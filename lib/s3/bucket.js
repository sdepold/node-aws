var sys = require("sys"),
    Key = require("./key").Key

exports.Bucket = function(s3Interface, bucketName, meta) {
  this.bucketName = bucketName
  this.meta = meta
  this.s3Interface = s3Interface
}

exports.Bucket.create = function(s3, bucketName, callback) {
  s3.s3Interface.createBucket(bucketName, {
    callback: function() { callback(new exports.Bucket(s3.s3Interface, bucketName)) },
    headers: {
      'x-amz-acl': 'public-read'
    }
  })
}

process.mixin(exports.Bucket.prototype, {
  clear: function(callback) {
    var _this = this
    
    this.keys({
      maxKeys: 50,
      callback: function(keys) {
        keys.each(function(key) { key.destroy() })
        _this.clear()
      }
    })
    
    if (callback) callback(true)
  },
  create: function(key, data) {
    
  },
  destroy: function(key) {
    
  },
  destroyFolder: function(folderKey) {
    
  },
  fullName: function() {
    
  },
  get: function() {
    
  },
  key: function(keyName) {
    
  },
  keys: function(options) {
    var _this = this
    var requestOptions = {
      bucketName: this.bucketName,
      restOptions: {"max-keys": 1000}.merge(options.restOptions || {}),
      callback: function(result) {
        var keys = []
        
        if(result.meta.contents)
          keys = result.meta.contents.map(function(keyData){ return new Key(_this, keyData) })

        if(options.callback) options.callback(keys)
      }
    }

    this.s3Interface.requestBuckets(requestOptions)
  },
  keysAndMeta: function() {
    
  },
  publicUrl: function() {
    
  },
  put: function() {
    
  },
  toString: function() {
    return sys.inspect(this)
  }
})