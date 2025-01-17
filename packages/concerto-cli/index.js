#!/usr/bin/env node
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Logger = require('@accordproject/concerto-core').Logger;
const Commands = require('./lib/commands');

require('yargs')
    .scriptName('concerto')
    .demandCommand(1, '# Please specify a command')
    .recommendCommands()
    .strict()
    .usage('$0 <cmd> [args]')
    .command('validate', 'validate JSON against model files', (yargs) => {
        yargs.option('sample', {
            describe: 'sample JSON to validate',
            type: 'string',
            default: 'sample.json'
        });
        yargs.option('ctoSystem', {
            describe: 'system model to be used',
            type: 'string'
        });
        yargs.option('ctoFiles', {
            describe: 'array of CTO files',
            type: 'string',
            array: true,
            default: '.'
        });
    }, (argv) => {
        if (argv.verbose) {
            Logger.info(`validate sample in ${argv.sample} against the models ${argv.ctoFiles}`);
        }

        return Commands.validate(argv.sample, argv.ctoSystem, argv.ctoFiles)
            .then((result) => {
                Logger.info(result);
            })
            .catch((err) => {
                Logger.error(err.message);
            });
    })
    .command('compile', 'generate code for a target platform', (yargs) => {
        yargs.option('ctoSystem', {
            describe: 'system model to be used',
            type: 'string'
        });
        yargs.option('ctoFiles', {
            describe: 'array of CTO files',
            type: 'string',
            array: true,
            default: '.'
        });
        yargs.option('target', {
            describe: 'target of the code generation',
            type: 'string',
            default: 'JSONSchema'
        });
        yargs.option('output', {
            describe: 'output directory path',
            type: 'string',
            default: './output/'
        });
    }, (argv) => {
        if (argv.verbose) {
            Logger.info(`generate code in format ${argv.format} from models ${argv.ctoFiles} into directory: ${argv.output}`);
        }

        return Commands.compile(argv.format, argv.ctoSystem, argv.ctoFiles, argv.output)
            .then((result) => {
                Logger.info(result);
            })
            .catch((err) => {
                Logger.error(err.message);
            });
    })
    .command('get', 'save local copies of external model dependencies', (yargs) => {
        yargs.option('ctoFiles', {
            describe: 'array of local CTO files',
            type: 'string',
            array: true,
            default: '.'
        });
        yargs.option('ctoSystem', {
            describe: 'system model to be used',
            type: 'string'
        });
        yargs.option('output', {
            describe: 'output directory path',
            type: 'string',
            default: './'
        });
    }, (argv) => {
        if (argv.verbose) {
            Logger.info(`saving external models from ${argv.ctoFiles} into directory: ${argv.output}`);
        }

        return Commands.get(argv.ctoSystem, argv.ctoFiles, argv.output)
            .then((result) => {
                Logger.info(result);
            })
            .catch((err) => {
                Logger.error(err.message);
            });
    })
    .option('verbose', {
        alias: 'v',
        default: false
    })
    .help()
    .argv;
