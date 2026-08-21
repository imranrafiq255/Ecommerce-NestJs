export default () => ({
    app : {
        nodeEnv : process.env.NODE_ENV?.toString(),
        port : Number(process.env.PORT) || 3000
    },
    database : {
        url : process.env.DATABASE_URL,
    },
    redis : {
        url : process.env.REDIS_URL
    },
    jwt : {
        jwtSecret : process.env.JWT_SECRET,
        jwtAccessTokenExpiresIn : process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    }
})
 