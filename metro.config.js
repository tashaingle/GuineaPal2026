// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Add support for importing from the src directory
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'svg'];
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// Add support for directory aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@navigation': path.resolve(__dirname, 'src/navigation'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@contexts': path.resolve(__dirname, 'src/contexts'),
  '@theme': path.resolve(__dirname, 'src/theme'),
  '@assets': path.resolve(__dirname, 'assets'),
  '@app': path.resolve(__dirname, 'app')
};

// Add support for watching additional directories
config.watchFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'src/contexts'),
  path.resolve(__dirname, 'src/components'),
  path.resolve(__dirname, 'src/screens'),
  path.resolve(__dirname, 'src/navigation'),
  path.resolve(__dirname, 'src/utils'),
  path.resolve(__dirname, 'src/theme'),
  path.resolve(__dirname, 'assets'),
  path.resolve(__dirname, 'app')
];

// Add better error handling and TypeScript support
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true
  }
};

// Add additional resolver options
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.disableHierarchicalLookup = true;

// Custom resolver to handle file extensions and prevent EISDIR errors
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    const basePath = path.resolve(__dirname, moduleName.replace('@/', 'src/'));
    
    // Check if the path exists and is a directory
    if (fs.existsSync(basePath)) {
      const stats = fs.statSync(basePath);
      
      if (stats.isDirectory()) {
        // If it's a directory, try to find index files
        const extensions = ['.tsx', '.ts', '.jsx', '.js'];
        for (const ext of extensions) {
          const indexPath = path.join(basePath, `index${ext}`);
          if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
            return {
              filePath: indexPath,
              type: 'sourceFile',
            };
          }
        }
      } else if (stats.isFile()) {
        // If it's a file, return it directly
        return {
          filePath: basePath,
          type: 'sourceFile',
        };
      }
    }

    // If not found or not a file/directory, try with extensions
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    for (const ext of extensions) {
      const filePath = basePath + ext;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return {
          filePath,
          type: 'sourceFile',
        };
      }
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Add TypeScript support
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Add project root configuration
config.projectRoot = __dirname;

// Add additional Metro configuration
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
config.transformer.unstable_allowRequireContext = true;

// Add cache configuration
config.cacheStores = [];
config.resetCache = true;

// Add error handling for EISDIR errors
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Add custom resolver to handle directory imports
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const result = context.resolveRequest(context, moduleName, platform);
  if (result && result.type === 'sourceFile' && fs.existsSync(result.filePath)) {
    const stats = fs.statSync(result.filePath);
    if (stats.isDirectory()) {
      return null;
    }
  }
  return result;
};

module.exports = config; 