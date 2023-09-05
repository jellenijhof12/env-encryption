# Env Encryption

**Env Encryption** is a command-line tool designed for encrypting and decrypting environment variables within frontend projects. Drawing inspiration from Laravel's encryption techniques, it offers a secure means of safeguarding sensitive environment configurations in client-side applications while enabling their safe inclusion in your version control system (Git).

## Installation

You can install the `env-encryption` package globally using npm:

```bash
npm install -g env-encryption
```

Alternatively, you can use it on the fly with `npx`, prefixing the commands with `npx`:

```bash
npx env-encryption 
```

## Usage

To use **Env Encryption**, run it from the command line with the following options:

```bash
env-encryption [command] --key <encryption-key> --env <environment> --filename <filename> [--force] [--cipher <cipher-algorithm>]
```

- `[command]`: Specify the operation to perform. Use either `encrypt` or `decrypt`.
- `--key <encryption-key>`: Specify the encryption key. If not provided, a random key will be generated.
- `--env <environment>`: Specify the environment name.
- `--filename <filename>`: Specify the target filename for decrypting (optional).
- `--force`: Overwrite existing files if they already exist (optional).
- `--cipher <cipher-algorithm>`: Specify the encryption cipher algorithm. The default is `aes-256-cbc` (optional).

## Examples

#### Encrypting Environment Variables

To encrypt environment variables, follow these steps:

1. Open your terminal.

2. Navigate to the root directory of your project.

3. Make sure a .env file is present for the env your encrypting (e.g., .env.production).

3. Run the following command, replacing the placeholders with your actual data:

   ```bash
   env-encryption encrypt --key <encryption-key> --env <environment-name> [--force] [--cipher <cipher-algorithm>]
   ```

   - `<encryption-key>`: Specify the encryption key. If not provided, a random key will be generated.
   - `<environment-name>`: Specify the environment name.
   - `--force` (optional): Use this flag to overwrite existing encrypted files.
   - `--cipher <cipher-algorithm>` (optional): Specify the encryption cipher algorithm (default is `aes-256-cbc`).

   Example:

   ```bash
   env-encryption encrypt --key mySecretKey --env production --force 
   ```

4. If you didn't specify an encryption key, the tool will generate a random key and display it in the terminal.

5. The encrypted environment file (e.g., `.env.production.encrypted`) will be created in your project directory.

#### Decrypting Environment Variables

To decrypt environment variables, follow these steps:

1. Open your terminal.

2. Navigate to the root directory of your project.

3. Make sure a .env file is present for the env your encrypting (e.g., .env.production.encrypted).

3. Run the following command, replacing the placeholders with your actual data:

   ```bash
   env-encryption decrypt --key <encryption-key> --env <environment-name> --filename <filename> [--force] [--cipher <cipher-algorithm>]
   ```

   - `<encryption-key>`: Specify the decryption key.
   - `<environment-name>`: Specify the environment name.
   - `<filename>`: Specify the target filename.
   - `--force` (optional): Use this flag to overwrite existing files.
   - `--cipher <cipher-algorithm>` (optional): Specify the encryption cipher algorithm (default is `aes-256-cbc`).

   Example:

   ```bash
   env-encryption decrypt --key mySecretKey --env production --filename .env --force 
   ```

4. The decrypted environment file (e.g., `.env`) will be created in your project directory.

## Commands

### Encrypt

To encrypt an environment file, use the `encrypt` command:

```bash
env-encryption encrypt --key <encryption-key> --env <environment> [--force] [--cipher <cipher-algorithm>]
```

- `<encryption-key>`: The encryption key (mandatory).
- `<environment>`: The environment name (mandatory).
- `--force`: Overwrite existing encrypted files (optional).
- `--cipher <cipher-algorithm>`: Specify the encryption cipher algorithm. The default is `aes-256-cbc` (optional).

If you omit the `--key` option, a random key will be generated and displayed.

### Decrypt

To decrypt an environment file, use the `decrypt` command:

```bash
env-encryption decrypt --key <encryption-key> --env <environment> --filename <filename> [--force] [--cipher <cipher-algorithm>]
```

- `<encryption-key>`: The decryption key (mandatory).
- `<environment>`: The environment name (mandatory).
- `<filename>`: The target filename where the content will be written (optional).
- `--force`: Overwrite existing files if they already exist (optional).
- `--cipher <cipher-algorithm>`: Specify the encryption cipher algorithm. The default is `aes-256-cbc` (optional).

## Error Handling

The utility includes basic error handling to ensure data integrity and security:

- It checks for the existence of input and output files.
- It verifies the encryption key's format and handles base64 encoding.
- It provides warnings when overwriting existing files.

## Logging

Logs are generated for each operation, including a timestamp and log level (INFO, SUCCESS, WARNING, ERROR). Logs are displayed in the terminal for monitoring and debugging.

## Dependencies

The utility uses the following Node.js modules:

- `optimist` for command-line argument parsing.
- `fs` for file system operations.
- `crypto` for cryptographic functions.
- `chalk` for colorized console output.

## License

This project is licensed under the MIT License.

## Author

- Jelle Nijhof
