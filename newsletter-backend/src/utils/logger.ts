import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'security-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/security-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/security.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  securityLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { securityLogger };
