import dotenv from 'dotenv'
import convict from 'convict';

dotenv.config();
export default convict({
  env: {
    default: 'dev',
    env: 'NODE_ENV',
  },
  http: {
    port: {
      doc: 'The port to listen on',
      default: 4000,
      env: 'PORT',
    },
    host: {
      default: 'http://localhost',
      env: 'HOST',
    }
  },
  api: {
    doc: 'Auth key for making requests',
    default: '',
    env: 'API_KEY',
  },
  mongoose: {
    doc: 'Mongoose connection string',
    default: 'mongodb://localhost:27017/sso',
    env: 'MONGODB_URI',
  },
  session: {
    express: {
      doc: 'The Secret is used on session-express',
      default: '53058a383ea6c18dfd92781bd3706de5b06782c6',
      env: 'SESSION_EXPRESS'
    }
  },
  cors: {
    default: ['http://localhost:3000'],
    env: 'CORS_ORIGIN'
  },
  url: {
    frontend: {
      default: 'http://localhost:3000',
      env: 'FRONTEND_URL'
    }
  },
  mail: {
    gmail: {
      account: {
        default: '',
        env: 'GMAIL_ACCOUNT'
      },
      clientID: {
        default: '',
        env: 'GMAIL_CLIENT_ID',
      },
      clientSecret: {
        default: '',
        env: 'GMAIL_SECRET',
      },
      refreshToken: {
        default: '',
        env: 'GMAIL_REFRESH_TOKEN',
      }
    }
  },
  authentication: {
    github: {
      clientID: {
        doc: 'The Client ID from Github to use for authentication',
        default: '',
        env: 'GITHUB_CLIENT_ID',
      },
      clientSecret: {
        doc: 'The Client Secret from Github to use for authentication',
        default: '',
        env: 'GITHUB_SECRET',
      },
      scope: {
        default: ['read:user'],
      },
    },
    google: {
      clientID: {
        doc: 'The Client ID from Google to use for authentication',
        default: '',
        env: 'GOOGLE_CLIENT_ID',
      },
      clientSecret: {
        doc: 'The Client Secret from Google to use for authentication',
        default: '',
        env: 'GOOGLE_SECRET',
      },
      scope: {
        default: ['profile email'],
      },
    },
    token: {
      secret: {
        doc: 'The signing key for the JWT',
        default: '09f26e402586e2faa8da4c98a35f1b20d6b033c609',
        env: 'JWT_SECRET',
      },
      issuer: {
        doc: 'The issuer for the JWT',
        default: '',
      },
      audience: {
        doc: 'The audience for the JWT',
        default: '',
      },
      expiresIn: {
        doc: 'expressed in seconds or a string describing a time span zeit/ms.',
        default: '24h',
        env: 'JWT_EXPIRES_IN',
      },
    },
    refreshToken: {
      expiresIn: {
        doc: 'expressed in seconds or a string describing a time span zeit/ms.',
        default: '24h',
        env: 'REFRESH_JWT_EXPIRES_IN',
      },
    },
  },
}).validate()