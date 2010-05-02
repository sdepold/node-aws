sys         = require("sys")
aws         = require(__dirname + "/../lib/aws")
credentials = require(__dirname + "/credentials"),

require("./nospec/nospec")

new NoSpec()
  .load(__dirname + "/s3.js")
  .run()