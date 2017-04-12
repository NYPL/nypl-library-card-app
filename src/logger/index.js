var winston = require('winston');
// Unexpected Errors will be handeled
winston.emitErrs = false;

const logLevel = (process.env.NODE_ENV === 'production') ? 'warn' : 'debug';

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: logLevel,
            filename: './log/get_a_library_card.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: logLevel,
            handleExceptions: true,
            json: true,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;