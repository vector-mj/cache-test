const redis = require("redis");
const mongoose = require("mongoose");
const util = require("util");
const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient({
  port      : 6379,
  host      : 'redis'
});

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.ttl = options.ttl || 30;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    console.log("DATA from MONGODB");
    return exec.apply(this, arguments);
  }
  console.log("DATA from REDIS");
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.collation.name,
    })
  );
  const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  } else {
    console.log("GET DATA FROM MONGO FOR REDIS");
  }

  const result = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, this.ttl);
  return result;
};

module.exports = {
  mongoose,
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
