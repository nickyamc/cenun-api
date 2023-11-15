import {env} from "process";

export default () => ({
    port: parseInt(env.PORT, 10) || 3000,
    database: {
        type: env.DATABASE_TYPE,
        ssl: env.DATABASE_SSL === 'true',
        host: env.POSTGRES_HOST,
    },
    postgres: {
        port: parseInt(env.POSTGRES_PORT, 10) || 5432,
        username: env.POSTGRES_USERNAME,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DATABASE,
    },
    mariadb: {
        port: parseInt(env.MARIADB_PORT, 10) || 3306,
        username: env.MARIADB_USERNAME,
        password: env.MARIADB_PASSWORD,
        database: env.MARIADB_DATABASE,
    },
    jwt: {
        secret: env.JWT_SECRET,
    }
});
