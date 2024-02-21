#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const optimist_1 = require("optimist");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const chalk_1 = __importDefault(require("chalk"));
const key = optimist_1.argv.key;
const env = optimist_1.argv.env;
const filename = optimist_1.argv.filename;
const inputFilename = optimist_1.argv.inputFilename;
const force = optimist_1.argv.force;
const cipher = (_a = optimist_1.argv.cipher) !== null && _a !== void 0 ? _a : 'aes-256-cbc';
process.on('uncaughtException', (error) => {
    log('error', error.message);
    process.exit(1); // Terminate the process
});
const commands = {
    "encrypt": encryptCommand,
    "decrypt": decryptCommand
};
const commandKey = optimist_1.argv._[0];
const command = commands[commandKey];
if (!command) {
    if (!commandKey) {
        throw new Error('Command is required');
    }
    throw new Error(`Command ${commandKey} not found`);
}
command(key, env, filename, force, inputFilename);
function encryptCommand(key, env, filename, force, inputFilename) {
    if (!key) {
        key = generateKey();
        log('info', 'Generated key: base64:' + Buffer.from(key).toString('base64'));
    }
    const envFile = inputFilename !== null && inputFilename !== void 0 ? inputFilename : getEnvFileName(env);
    var data = getFile(envFile);
    var encrypted = encrypt(data, parseKey(key));
    writeFile(envFile + '.encrypted', encrypted, force);
    log('success', 'Encrypted to ' + envFile + '.encrypted');
}
function decryptCommand(key, env, filename, force, inputFilename) {
    if (!key) {
        throw new Error('Key is required');
    }
    const envFile = inputFilename !== null && inputFilename !== void 0 ? inputFilename : getEnvFileName(env);
    var data = getFile(envFile + '.encrypted');
    var decrypted = decrypt(data, parseKey(key));
    writeFile(filename !== null && filename !== void 0 ? filename : envFile, decrypted, force);
    log('success', 'Decrypted to ' + (filename !== null && filename !== void 0 ? filename : envFile));
}
function log(level, message) {
    const timestamp = new Date().toISOString();
    const logLevels = {
        info: chalk_1.default.blue('INFO'),
        success: chalk_1.default.green('SUCCESS'),
        warning: chalk_1.default.yellow('WARNING'),
        error: chalk_1.default.red('ERROR'),
    };
    console.log(`[${timestamp}] [${logLevels[level]}] ${message}`);
}
function getEnvFileName(env) {
    return ['env', env].filter(e => e).map(key => '.' + key).join('');
}
function generateKey() {
    return crypto_1.default.randomBytes(32);
}
function parseKey(key) {
    if (key instanceof Buffer) {
        return key;
    }
    if (key.startsWith('base64:')) {
        return Buffer.from(key.substring(7), 'base64');
    }
    return Buffer.from(key);
}
function getFile(path) {
    if (!fs_1.default.existsSync(path)) {
        throw new Error(`File ${path} not found`);
    }
    return fs_1.default.readFileSync(path, 'utf8');
}
function writeFile(path, data, force) {
    if (!force && fs_1.default.existsSync(path)) {
        throw new Error(`File ${path} already exists. Use --force to overwrite`);
    }
    fs_1.default.writeFileSync(path, data, 'utf8');
}
function encrypt(data, key) {
    const iv = crypto_1.default.randomBytes(16);
    const cipheriv = crypto_1.default.createCipheriv(cipher, key, iv);
    const encrypted = Buffer.concat([cipheriv.update(data), cipheriv.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(data, key) {
    const [iv, encrypted] = data.split(':').map(s => Buffer.from(s, 'hex'));
    const decipher = crypto_1.default.createDecipheriv(cipher, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
}
