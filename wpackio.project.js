const path = require('path');
const pkg = require('./package.json');

module.exports = {
    appName: 'easyTeachLMS',
    type: 'plugin',
    slug: 'easyteachlms',
    bannerConfig: {
        name: 'easyteachlms',
        author: 'Seth Rubenstein for Cliff Michaels and Associates',
        license: 'MIT',
        link: 'MIT',
        version: pkg.version,
        copyrightText:
            'This software is released under the MIT License\nhttps://opensource.org/licenses/MIT',
        credit: true,
    },
    files: [
        // WP Admin (Backend)
        {
            name: 'wp-admin',
            entry: {
                wooCommerceCourseField: './inc/woocommerce/index.js',
                settings: './inc/settings/index.js',
                bpCohortsWidget: './inc/buddypress/cohorts/widget/index.js',
                bpCoursesField: './inc/buddypress/courses-field/index.js',
            },
            optimizeForGutenberg: true,
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
                lessonContent: './inc/lesson/content/index.js',
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
                enrollButton: './inc/enrollment/index.js',
            },
            optimizeForGutenberg: true,
        },
    ],
    outputPath: 'dist',
    hasReact: true,
    // Whether or not to use the new jsx runtime introduced in React 17
	// this is opt-in
	// @see {https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html}
	useReactJsxRuntime: false,
	// Disable react refresh
	disableReactRefresh: false,
    hasSass: true,
    hasLess: false,
    hasFlow: false,
    externals: {
        moment: 'moment',
        '@babel/runtime/regenerator': 'regeneratorRuntime',
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
    // whether or not to disable wordpress external scripts handling
	disableWordPressExternals: false,
};
