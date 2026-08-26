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
        jwtAccessSecret : process.env.JWT_ACCESS_SECRET,
        jwtAccessTokenExpiresIn : process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        jwtRefreshSecret : process.env.JWT_REFRESH_SECRET,
        jwtRefreshTokenExpiresIn : process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    }
})
 