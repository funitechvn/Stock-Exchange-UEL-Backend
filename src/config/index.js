module.exports = {
    PORT: "1309",
    SECRET: "Stock_Exchange_UEL_secret",
    DATA_COLLECTION: "Stock_Exchange_UEL",
    SESSION: {
        name: 'session_Stock_Exchange_UEL',
        proxy: true,
        resave: true,
        secret: "session_Stock_Exchange_UEL.secrect", // session secret
        saveUninitialized: true,
        cookie: {
            secure: false /*Use 'true' without setting up HTTPS will result in redirect errors*/,
        }
    },
    DEBUG: {
        server: "Stock_Exchange_UEL"
    },
    IS_ADMIN: ["ADMIN"],
    IS_USER: ["*"],
    UPGRADE_NUMBER: 5
}