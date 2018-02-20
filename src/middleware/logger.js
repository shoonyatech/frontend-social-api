import fs from 'fs';
import logger from 'morgan';
import rfs from 'rotating-file-stream';

module.exports = (format, directory) => {

    fs.existsSync(directory) || fs.mkdirSync(directory)

    const stream = rfs('app.log', {
        size: '10M', // rotate every 10 MegaBytes written 
        interval: '1d',  // rotate daily 
        path: directory // log directory
    });

    return logger(format, { stream });
}