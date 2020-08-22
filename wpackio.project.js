const path = require('path');
const pkg = require('./package.json');

module.exports = {
    appName: 'easyTeachLMS',
    type: 'plugin',
    slug: 'easyteachlms',
    bannerConfig: {
        name: 'easyteachlms',
        author: 'Seth Rubenstein for Cliff Michaels and Associates',
        license: 'UNLICENSED',
        link: 'UNLICENSED',
        version: pkg.version,
        copyrightText:
            'This software is released under the UNLICENSED License\nhttps://opensource.org/licenses/UNLICENSED',
        credit: true,
    },
    files: [
        // App Frontend
        {
            name: 'app',
            entry: {
                course: './app/js/course/index.js',
                enrollButton: './app/js/enroll-button/index.js',
                myCourses: './app/js/my-courses/index.js',
            },
        },
        {
            name: 'admin',
            entry: {
                settings: './app/js/admin/settings/index.js',
                buddyPress: './app/js/admin/buddypress/index.js',
            },
        },
        // WordPress Plugins
        {
            name: 'woocommerce',
            entry: {
                productEdit: './app/js/woocommerce/product-edit.js',
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
            name: 'certificate',
            entry: {
                'certificate-block': './blocks/certificate/index.js',
                'date-block': './blocks/certificate-date/index.js',
                'student-block': './blocks/certificate-student/index.js',
            },
        },
        {
            name: 'lesson-block',
            entry: {
                block: './blocks/lesson/index.js',
            },
        },
        {
            name: 'lesson-content-block',
            entry: {
                block: './blocks/lesson-content/index.js',
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
    ],
    // Output path relative to the context directory
    // We need relative path here, else, we can not map to publicPath
    outputPath: 'dist',
    hasReact: true,
    hasSass: true,
    hasLess: false,
    hasFlow: false,
    externals: {
        jquery: 'jQuery',
        lodash: 'lodash',
        moment: 'moment',
        react: 'React',
        'react-dom': 'ReactDOM',
        'lodash-es': 'lodash',
        '@babel/runtime/regenerator': 'regeneratorRuntime',
        '@wordpress/autop': 'wp.autop',
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
    alias: {
        '@easyteachlms/shared': path.resolve(__dirname, 'app/js/_shared'),
        '@easyteachlms/components': path.resolve(
            __dirname,
            'blocks/_shared/components',
        ),
        '@easyteachlms/utils': path.resolve(__dirname, 'blocks/_shared/utils'),
    },
    errorOverlay: true,
    // Auto optimization by webpack
    // Split all common chunks with default config
    // <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
    // Won't hurt because we use PHP to automate loading
    optimizeSplitChunks: true,
    // Usually PHP and other files to watch and reload when changed
    watch: './inc|includes/**/*.php',
    packageFiles: [
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
    packageDirPath: 'package',
};
