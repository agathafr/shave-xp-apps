require("dotenv/config");

const devConfig = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_NAME,
    entities: [
      './dist/modules/**/infra/typeorm/entities/*.js'
    ],
    migrations: [
      './dist/shared/infra/typeorm/seeds/*.js'
    ],
    cli: {
      migrationsDir: './dist/shared/infra/typeorm/seeds',
    },
    ssl: { rejectUnauthorized: false },
  }
];

const prodConfig = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_NAME,
    entities: [
      './dist/modules/**/infra/typeorm/entities/*.js'
    ],
    migrations: [
      './dist/shared/infra/typeorm/seeds/*.js'
    ],
    cli: {
      migrationsDir: './dist/shared/infra/typeorm/seeds',
    },
    ssl: { rejectUnauthorized: false },
  }
];

module.exports = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
