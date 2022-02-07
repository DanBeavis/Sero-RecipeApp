import { cleanEnv, host, port } from 'envalid';

// this ensures env vars exist and are the correct format
const env = cleanEnv(process.env, {
  MONGODB_PORT: port({
    devDefault: 27017,
    desc: 'Port to access mongodb',
    example: '27017',
  }),
  MONGODB_HOST: host({
    devDefault: '0.0.0.0',
    desc: 'Host to run the server on',
    example: '0.0.0.0',
  }),
  MONGODB_DB_NAME: host({
    devDefault: 'sero',
    desc: 'Name of the db',
    example: 'sero',
  }),
});

export default env;
