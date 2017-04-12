import winston from 'winston';
import path from 'path';

const winstonLogger = winston.configure({
    transports: [
        new (winston.transports.File)({ filename: path.join('.', 'log', 'get_a_library_card.log') }),
        new (winston.transports.Console)()
    ]
});

export { winstonLogger };