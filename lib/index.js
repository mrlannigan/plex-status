const Wreck = require('wreck');
const Parser = require('xml2js').Parser;
const Joi = require('joi');
const validation = require('./validation');
const util = require('./util');

exports.get = (options, callback) => {
    const validationResult = Joi.validate(options, validation.options, {
        allowUnknown: true
    });

    let prom = new Promise((resolve, reject) => {
        if (!validationResult.error) {
            const url = `${util.generateRequestUrl(validationResult.value)}/status/sessions`;
            const reqOpts = {
                headers: {
                    'X-Plex-Token': validationResult.value.authToken,
                }
            };

            Wreck.get(url, reqOpts, (err, response, payload) => {
                const parser = new Parser({ mergeAttrs: true, explicitArray: false });

                if (!err && response.statusCode === 200) {
                    parser.parseString(payload.toString('utf8'), (error, result) => {
                        if (!error) {
                            resolve(util.processOutput(result));
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    reject(err || new Error(`Non-200 status code returned, ${response.statusCode}`));
                }
            });
        } else {
            reject(validationResult.error);
        }
    });

    if (callback) {
        prom = prom.then((result) => {
            callback(null, result);
        }).catch(callback);
    }

    return prom;
};
