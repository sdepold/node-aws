var sys = require("sys")

exports.Bucket = function(bucketName) {
  this.bucketName = bucketName
}

process.mixin(exports.Bucket.prototype, {
  clear: function() {

  },
  create: function(key, data) {

  },
  remove: function(key) {

  },
  removeFolder: function(folderKey) {

  },
  fullName: function() {

  },
  get: function() {

  },
  key: function() {

  },
  keys: function() {

  },
  keysAndMeta: function() {

  },
  publicUrl: function() {

  },
  put: function() {

  },
  toString: function() {
    return "foo"
  }
})