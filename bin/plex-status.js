#!/usr/bin/env node

const plexStatus = require('../lib');
const yargs = require('yargs');

const argv = yargs
    .usage('$0 -t [token]')
    .options({
        t: {
            group: 'Authenication',
            alias: 'token',
            demand: true,
            describe: 'Authenication token',
            type: 'string'
        },
        host: {
            group: 'Connection Information',
            demand: false,
            default: 'localhost',
            describe: 'Hostname of plex service',
            type: 'string'
        },
        port: {
            group: 'Connection Information',
            demand: false,
            default: 32400,
            describe: 'Port of plex service',
            type: 'number'
        },
        https: {
            group: 'Connection Information',
            demand: false,
            default: false,
            describe: 'Use https protocol',
            type: 'boolean'
        }
    })
    .help('?')
    .alias('?', 'help')
    .argv;

const options = Object.assign({ authToken: argv.token, hostname: argv.host }, argv);

plexStatus.get(options)
    .then((results) => {
        const str = results.map(JSON.stringify);

        process.stdout.write(`${str.join('\n')}`);

        if (str.length) {
            process.stdout.write('\n');
        }

        process.exit(0);
    })
    .catch((err) => {
        process.stderr.write(`${JSON.stringify({
            status: false,
            timestamp: new Date().toISOString(),
            message: err.message,
            stack: err.stack
        })}\n`);

        process.exit(1);
    });
