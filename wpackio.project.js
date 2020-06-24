const path = require('path');
const pkg = require('./package.json');

module.exports = {
    // Project Identity
    appName: 'easyTeachLMS', // Unique name of your project
    type: 'plugin', // Plugin or theme
    slug: 'easyteachlms', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
    // Used to generate banners on top of compiled stuff
    bannerConfig: {
        name: 'easyteachlms',
        author: '',
        license: 'UNLICENSED',
        link: 'UNLICENSED',
        version: pkg.version,
        copyrightText:
            'This software is released under the UNLICENSED License\nhttps://opensource.org/licenses/UNLICENSED',
        credit: true,
    },
    // Files we need to compile, and where to put
    files: [
        // App Frontend
        {
            name: 'app',
            entry: {
                course: './assets/js/course/index.js',
            },
        },
        // WordPress Plugins
        {
            name: 'woocommerce',
            entry: {
                productEdit: './assets/js/woocommerce/product-edit.js',
            },
        },
        // Blocks
        {
            name: 'ghost-block',
            entry: {
                block: './blocks/ghost-block/index.js',
            },
        },
        {
            name: 'course-block',
            entry: {
                block: './blocks/course/index.js',
            },
        },
        {
            name: 'lesson-block',
            entry: {
                block: './blocks/lesson/index.js',
            },
        },
        {
            name: 'quiz',
            entry: {
                'quiz-block': './blocks/quiz/index.js',
                'question-block': './blocks/question/index.js',
                'answer-block': './blocks/answer/index.js',
            },
        },
        {
            name: 'topic-block',
            entry: {
                block: './blocks/topic/index.js',
            },
        },
    ],
    // Output path relative to the context directory
    // We need relative path here, else, we can not map to publicPath
    outputPath: 'dist',
    // Project specific config
    // Needs react(jsx)?
    hasReact: true,
    // Needs sass?
    hasSass: true,
    // Needs less?
    hasLess: false,
    // Needs flowtype?
    hasFlow: false,
    // Externals
    // <https://webpack.js.org/configuration/externals/>
    externals: {
        jquery: 'jQuery',
        lodash: 'lodash',
        moment: 'moment',
        react: 'React',
        'react-dom': 'ReactDOM',
        'lodash-es': 'lodash',
        '@babel/runtime/regenerator': 'regeneratorRuntime',
        '@wordpress/api-fetch': 'wp.apiFetch',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/data': 'wp.data',
        '@wordpress/dom-ready': 'wp.domReady',
        '@wordpress/components': 'wp.components',
        '@wordpress/element': 'wp.element',
        '@wordpress/edit-post': 'wp.editPost',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/plugins': 'wp.plugins',
        '@wordpress/url': 'wp.url',
    },
    // Webpack Aliases
    // <https://webpack.js.org/configuration/resolve/#resolve-alias>
    alias: {
        '@easyteachlms/components': path.resolve(
            __dirname,
            'blocks/_shared/components',
        ),
        '@easyteachlms/utils': path.resolve(__dirname, 'blocks/_shared/utils'),
    },
    // Show overlay on development
    errorOverlay: true,
    // Auto optimization by webpack
    // Split all common chunks with default config
    // <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
    // Won't hurt because we use PHP to automate loading
    optimizeSplitChunks: true,
    // Usually PHP and other files to watch and reload when changed
    watch: './inc|includes/**/*.php',
    // Files that you want to copy to your ultimate theme/plugin package
    // Supports glob matching from minimatch
    // @link <https://github.com/isaacs/minimatch#usage>
    packageFiles: [
        'assets/**',
        'inc/**',
        'vendor/**',
        'dist/**',
        '*.php',
        '*.md',
        'readme.txt',
        'languages/**',
        'layouts/**',
        'LICENSE',
        '*.css',
    ],
    // Path to package directory, relative to the root
    packageDirPath: 'package',
};
