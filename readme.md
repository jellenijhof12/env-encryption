# Laravel Env Encryption

**Frontend Env Encryption** is a tool designed for encrypting and decrypting environment variables within frontend projects. Drawing inspiration from Laravel's encryption techniques, it offers a secure means of safeguarding sensitive environment configurations in client-side applications while enabling their safe inclusion in your version control system (Git).

## Installation

You can install the `laravel-env-encryption` package globally using npm:

```bash
npm install -g laravel-env-encryption
```

Or use it on the fly with npx, prefixing the commands with npx:
```bash
npx laravel-env-encryption 
```

## Usage

To use **Laravel Env Encryption**, run it from the command line with the following options:

```bash
laravel-env-encryption [command] --key <encryption-key> --env <environment> --file <filename> [--force]
```

- `[command]`: Specify the operation to perform. Use either `encrypt` or `decrypt`.
- `--key <encryption-key>`: Specify the encryption key. If not provided, a random key will be generated.
- `--env <environment>`: Specify the environment name.
- `--file <filename>`: Specify the environment file to encrypt or decrypt.
- `--force`: Overwrite existing files if they already exist (optional).

## Commands

### Encrypt

To encrypt an environment file, use the `encrypt` command:

```bash
laravel-env-encryption encrypt --key <encryption-key> --env <environment> --file <filename> [--force]
```

- `<encryption-key>`: The encryption key (mandatory).
- `<environment>`: The environment name (mandatory).
- `<filename>`: The environment file to encrypt (mandatory).
- `--force`: Overwrite existing encrypted files (optional).

If you omit the `--key` option, a random key will be generated and displayed.

### Decrypt

To decrypt an environment file, use the `decrypt` command:

```bash
laravel-env-encryption decrypt --key <encryption-key> --env <environment> --file <filename> [--force]
```

- `<encryption-key>`: The decryption key (mandatory).
- `<environment>`: The environment name (mandatory).
- `<filename>`: The environment file to decrypt (mandatory).
- `--force`: Overwrite existing files if they already exist (optional).

## Error Handling

The utility includes basic error handling to ensure data integrity and security:

- It checks for the existence of input and output files.
- It verifies the encryption key's format and handles base64 encoding.
- It provides warnings when overwriting existing files.

## Logging

Logs are generated for each operation, including timestamp and log level (INFO, WARNING, ERROR). Logs are displayed in the terminal for monitoring and debugging.

## Dependencies

The utility uses the following Node.js modules:

- `optimist` for command-line argument parsing.
- `fs` for file system operations.
- `crypto` for cryptographic functions.
- `chalk` for colorized console output.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- Jelle Nijhof