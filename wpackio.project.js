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
        {
            name: 'cohorts',
            entry: {
                'my-groups-widget': './inc/cohorts/my-groups-widget/index.js',
            },
        },
        // Overall App Scripts, runs both in WP-Admin and Frontend.
        {
            name: 'app',
            entry: {
                enrollButton: './app/js/enroll-button/index.js',
                myCourses: './app/js/my-courses/index.js',
                buddyPress: './app/js/buddypress/index.js',
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
            name: 'blocks',
            entry: {
                course: './inc/course/controller/index.js',
                certificate: './inc/certificate/controller/index.js',
                certificateDate: './inc/certificate/date/index.js',
                certificateStudentName: './inc/certificate/student-name/index.js',
                lesson: './inc/lesson/controller/index.js',
                lessonContent: './inc/lesson/controller/index.js',
                ghost: './inc/ghost-block/index.js',
                quiz: './inc/quiz/controller/index.js',
                quizAnswer: './inc/quiz/answer/index.js',
                quizQuestion: './inc/quiz/question/index.js',
            },
            optimizeForGutenberg: true,
        },
        {
            name: 'frontend',
            entry: {
                course: './inc/course/frontend/index.js',
                quiz: './inc/quiz/frontend/index.js',
            },
        },
    ],
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
        '@wordpress/api-fetch': 'wp.apiFetch',
        '@wordpress/autop': 'wp.autop',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/components': 'wp.components',
        '@wordpress/data': 'wp.data',
        '@wordpress/date': 'wp.date',
        '@wordpress/dom-ready': 'wp.domReady',
        '@wordpress/edit-post': 'wp.editPost',
        '@wordpress/element': 'wp.element',
        '@wordpress/escape-html': 'wp.escapeHtml',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/icons': 'wp.icons',
        '@wordpress/plugins': 'wp.plugins',
        '@wordpress/url': 'wp.url',
    },
    alias: {
        '@easyteachlms/components': path.resolve(
            __dirname,
            'inc/_shared-js/components',
        ),
        '@easyteachlms/utils': path.resolve(__dirname, 'inc/_shared-js/utils'),
    },
    errorOverlay: true,
    optimizeSplitChunks: true,
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
