const Redis = require("ioredis")
// redis-cli -u redis://default:9y6J4ZGMEaD5Jo6qaD82hrwBljPlAPWa@redis-10247.c54.ap-northeast-1-2.ec2.redns.redis-cloud.com:10247

const redis = new Redis({
    port:10247 ,
    host: "redis-10247.c54.ap-northeast-1-2.ec2.redns.redis-cloud.com",
    username: "default" ,
    password: "9y6J4ZGMEaD5Jo6qaD82hrwBljPlAPWa",
    db: 0 ,
})


module.exports = redis