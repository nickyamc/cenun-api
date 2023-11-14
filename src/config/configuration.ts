import {env} from "process";

export default () => ({
    port: parseInt(env.PORT, 10) || 3000,
    database: {
        host: env.DATABASE_HOST,
        port: parseInt(env.DATABASE_PORT_POSTGRESQL, 10) || 3306,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_DATABASE,
    },
    jwt: {
        secret: env.JWT_SECRET,
    }
});
