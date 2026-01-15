// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Add support for importing from the src directory
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'svg'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf', 'otf'];

// Configure aliases
config.resolver.alias = {
    '@': path.resolve(__dirname, 'src'),
};

// Enable symlinks
config.resolver.enableGlobalPackages = true;
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Configure watchFolders
config.watchFolders = [
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules'),
];

// Configure source maps
config.transformer.minifierConfig = {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
        keep_classnames: true,
        keep_fnames: true,
    },
};

// Configure error reporting
config.reporter = {
    update: () => {},
    error: (error) => {
        // Filter out EISDIR errors as they're usually harmless
        if (error.message && error.message.includes('EISDIR')) {
            console.warn('Metro EISDIR warning (usually harmless):', error.message);
            return;
        }
        console.error('Metro Error:', {
            type: error.type,
            message: error.message,
            stack: error.stack,
            codeFrame: error.codeFrame,
        });
    },
};

// Add extraNodeModules for vector icons
config.resolver.extraNodeModules = {
    '@expo/vector-icons': path.resolve(__dirname, 'node_modules/@expo/vector-icons'),
};

// Add resolver configuration to prevent EISDIR errors
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configure file resolution to handle directories properly
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Handle any special module resolution here if needed
    return context.resolveRequest(context, moduleName, platform);
};

// Add transformer configuration to handle errors better
config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
    },
});

module.exports = config; 