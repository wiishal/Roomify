import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_URL || "redis",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
};
export const pub = new Redis(redisConfig);
export const sub = new Redis(redisConfig);
export const cache = new Redis(redisConfig)
export const rateLimiterRedis = new Redis(redisConfig)

export let onMessageBroker = {
    onRedisMessage:(msg:any):void => {}
}
sub.subscribe("messageBroker", () => {
  console.log("subcribe to messageBroker");
});

sub.on("message", (channel, message) => {
  if (channel !== "messageBroker") return;
  const msg = JSON.parse(message);
  if (onMessageBroker) {
    onMessageBroker.onRedisMessage(msg);
  }
});
