import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const transports = {
  console: new winston.transports.Console(),
  infoFile: new winston.transports.File({
    dirname: path.join(__dirname, '../', '/log/info'),
    filename: 'server_info.log',
    maxsize: 1024 * 1024 * 15,
  }),
  errorFile: new winston.transports.File({
    dirname: path.join(__dirname, '../', '/log/error'),
    filename: 'server_error.log',
    maxsize: 1024 * 1024 * 15,
  }),
};

const formatter = winston.format.combine(winston.format.timestamp(), winston.format.json());

function generateLog(loggerType: 'info' | 'error') {
  if (loggerType === 'info') {
    return expressWinston.logger({
      transports: [transports.console, transports.infoFile],
      format: formatter,
      msg: (req, res) => {
        return `request id: ${uuidv4()}`;
      },
    });
  } else if (loggerType === 'error') {
    return expressWinston.errorLogger({
      transports: [transports.console, transports.errorFile],
      format: formatter,
      msg: (req, res) => {
        return `request id: ${uuidv4()}`;
      },
    });
  }
}

export const errorLog = generateLog('error');
export const infoLog = generateLog('info');
