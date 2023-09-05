#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const optimist_1 = require("optimist");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const chalk_1 = __importDefault(require("chalk"));
const key = optimist_1.argv.key;
const env = optimist_1.argv.env;
const filename = optimist_1.argv.filename;
const force = optimist_1.argv.force;
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
command(key, env, filename, force);
function encryptCommand(key, env, filename, force) {
    if (!key) {
        key = generateKey();
        log('info', 'Generated key: base64:' + key);
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile);
    var encrypted = encrypt(data, key);
    writeFile(envFile + '.encrypted', encrypted, force);
}
function decryptCommand(key, env, filename, force) {
    if (!key) {
        throw new Error('Key is required');
    }
    if (key.startsWith('base64:')) {
        key = key.substring(7);
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile + '.encrypted');
    var decrypted = decrypt(data, key);
    writeFile(filename !== null && filename !== void 0 ? filename : envFile, decrypted, force);
}
function log(level, message) {
    const timestamp = new Date().toISOString();
    const logLevels = {
        info: chalk_1.default.blue('INFO'),
        warning: chalk_1.default.yellow('WARNING'),
        error: chalk_1.default.red('ERROR'),
    };
    console.log(`[${timestamp}] [${logLevels[level]}] ${message}`);
}
function getEnvFileName(env) {
    return ['env', env].filter(e => e).map(key => '.' + key).join('');
}
function generateKey() {
    return crypto_1.default.randomBytes(32).toString('base64');
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
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(data, key) {
    var _a;
    const parts = data.split(':');
    const iv = Buffer.from((_a = parts.shift()) !== null && _a !== void 0 ? _a : '', 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}
