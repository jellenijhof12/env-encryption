#!/usr/bin/env node
import { argv } from 'optimist';
import fs from 'fs';
import crypto from 'crypto';
import chalk from 'chalk';

const key = argv.key;
const env = argv.env;
const filename = argv.filename;
const force = argv.force;
const cipher = argv.cipher ?? 'aes-256-cbc';

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

function encryptCommand(key: string|Buffer, env: string, filename: string, force: boolean) {
    if (!key) {
        key = generateKey();
        log('info', 'Generated key: base64:' + Buffer.from(key).toString('base64'));
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile);
    var encrypted = encrypt(data, parseKey(key));
    writeFile(envFile + '.encrypted', encrypted, force);
    log('success', 'Encrypted to ' + envFile + '.encrypted');
}

function decryptCommand(key: string, env: string, filename: string, force: boolean) {
    if (!key) {
        throw new Error('Key is required');
    }
    const envFile = getEnvFileName(env);
    var data = getFile(envFile + '.encrypted');
    var decrypted = decrypt(data, parseKey(key));
    writeFile(filename ?? envFile, decrypted, force);
    log('success', 'Decrypted to ' + filename ?? envFile);
}

function log(level: string, message: string) {
    const timestamp = new Date().toISOString();
    const logLevels = {
        info: chalk.blue('INFO'),
        success: chalk.green('SUCCESS'),
        warning: chalk.yellow('WARNING'),
        error: chalk.red('ERROR'),
    };

    console.log(`[${timestamp}] [${logLevels[level as keyof typeof logLevels]}] ${message}`);
}

function getEnvFileName(env: string) {
    return ['env', env].filter(e => e).map(key => '.' + key).join('');
}

function generateKey() {
    return crypto.randomBytes(32);
}

function parseKey(key: string|Buffer) {
    if (key instanceof Buffer) {
        return key;
    }

    if (key.startsWith('base64:')) {
        return Buffer.from(key.substring(7), 'base64');
    }

    return Buffer.from(key);
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

function encrypt(data: string, key: Buffer) {
    const iv = crypto.randomBytes(16);
    const cipheriv = crypto.createCipheriv(cipher, key, iv);
    const encrypted = Buffer.concat([cipheriv.update(data), cipheriv.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data: string, key: Buffer) {
    const [iv, encrypted] = data.split(':').map(s => Buffer.from(s, 'hex'));
    const decipher = crypto.createDecipheriv(cipher, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
}
