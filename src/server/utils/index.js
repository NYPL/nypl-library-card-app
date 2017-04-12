import winston from 'winston';
import path from 'path';

winston.configure({
    transports: [
        new (winston.transports.File)({ filename: path.join('.', 'log', 'get_a_library_card.log') }),
        new (winston.transports.Console)()
    ]
});

export function logger(req,res,next){
    req.app.set('logger', winston);
    next();
};