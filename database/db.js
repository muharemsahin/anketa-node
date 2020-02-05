const pg = require("pg");

var config = {
    user: 'nnjwyzao',
    database: 'nnjwyzao',
    password: 'BX0s3ljx28OoVdZYIlpv0X5eujs0RILd', //env var: PGPASSWORD
    host: 'manny.db.elephantsql.com',
    port: 5432,
    max: 3,
    idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

module.exports = pool;
