const { createClient } = require('redis');

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 16424
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('connect to redis success !');
    } catch (error) {
        console.log('connect to redis failed !', error.message);
    }

}

connectRedis();


module.exports = client;