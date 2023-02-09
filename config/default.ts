export default {
    port: process.env.PORT || 3000,
    dbUri: "mongodb://localhost:27017/auth-app",
    logLevel: "info",
    accessTokenPrivateKey: '',
    refreshTokenPrivateKey: '',
    smtp: {
        user: 'alogdricrqensyy4@ethereal.email',
        pass: 'SXJ8CjwAykdbKPYzGD',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false
    }
}