const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  ...defaultConfig,
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'json'],
    assetExts: [...defaultConfig.resolver.assetExts, 'ttf', 'otf', 'woff', 'woff2'],
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
  },
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};

module.exports = config;