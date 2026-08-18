export default () => ({
    app : {
        nodeEnv : process.env.NODE_ENV?.toString(),
        port : Number(process.env.PORT) || 3000
    },
    database : {
        url : process.env.DATABASE_URL,
    }
})
 