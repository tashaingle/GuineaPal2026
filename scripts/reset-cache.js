const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logger } = require('../src/utils/logger');

const ROOT_DIR = path.resolve(__dirname, '..');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
  } catch (error) {
    logger.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
}

function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    logger.info(`Cleaned directory: ${dir}`);
  }
}

// Clean build directories
cleanDirectory(path.join(ROOT_DIR, 'android', 'app', 'build'));
cleanDirectory(path.join(ROOT_DIR, 'ios', 'build'));
cleanDirectory(path.join(ROOT_DIR, '.expo'));

// Clean node modules and reinstall
logger.info('Cleaning node_modules...');
cleanDirectory(path.join(ROOT_DIR, 'node_modules'));
cleanDirectory(path.join(ROOT_DIR, 'package-lock.json'));

logger.info('Installing dependencies...');
runCommand('npm install');

// Clean watchman
logger.info('Cleaning watchman...');
runCommand('watchman watch-del-all');

// Clean metro bundler cache
logger.info('Cleaning metro bundler cache...');
runCommand('npx react-native start --reset-cache');

logger.info('Cache reset complete!'); 