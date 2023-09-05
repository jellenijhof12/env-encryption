#!/usr/bin/node
import { argv } from 'optimist';
import fs from 'fs';
import crypto from 'crypto';
import chalk from 'chalk';

const key = argv.key;
const env = argv.env;
const filename = argv.filename;
const force = argv.force;

process.on('uncaughtException', (error: { message: string }) => {
    log('error', error.message);
    process.exit(1); // Terminate the process
});

const commands = {
    "encrypt": encryptCommand,
    "decrypt": decryptCommand
};
const commandKey = argv._[0];
const command = commands[commandKey as keyof typeof commands];
if (!command) {
    if (!commandKey) {
        throw new Error('Command is required');
    }
    throw new Error(`Command ${commandKey} not found`);
}
command(key, env, filename, force);

function encryptCommand(key: string, env: string, filename: string, force: boolean) {
    if (!key) {
        key = generateKey();
        log('info', 'Generated key: base64:' + key)
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile);
    var encrypted = encrypt(data, key);
    writeFile(envFile + '.encrypted', encrypted, force);
}

function decryptCommand(key: string, env: string, filename: string, force: boolean) {
    if (!key) {
        throw new Error('Key is required');
    }
    if (key.startsWith('base64:')) {
        key = key.substring(7);
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile + '.encrypted');
    var decrypted = decrypt(data, key);
    writeFile(filename ?? envFile, decrypted, force);
}

function log(level: string, message: string) {
    const timestamp = new Date().toISOString();
    const logLevels = {
        info: chalk.blue('INFO'),
        warning: chalk.yellow('WARNING'),
        error: chalk.red('ERROR'),
    };

    console.log(`[${timestamp}] [${logLevels[level as keyof typeof logLevels]}] ${message}`);
}

function getEnvFileName(env: string) {
    return ['env', env].filter(e => e).map(key => '.' + key).join('');
}

function generateKey() {
    return crypto.randomBytes(32).toString('base64');
}

function getFile(path: string) {
    if (!fs.existsSync(path)) {
        throw new Error(`File ${path} not found`);
    }

    return fs.readFileSync(path, 'utf8');
}

function writeFile(path: string, data: string, force: boolean) {
    if (!force && fs.existsSync(path)) {
        throw new Error(`File ${path} already exists. Use --force to overwrite`);
    }

    fs.writeFileSync(path, data, 'utf8');
}

function encrypt(data: string, key: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data: string, key: string) {
    const parts = data.split(':');
    const iv = Buffer.from(parts.shift() ?? '', 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}
