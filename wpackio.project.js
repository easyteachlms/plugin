const pkg = require('./package.json');
const path = require('path');

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
		{
            name: 'easyteachlms',
            entry: {
                app: './assets/js/app.js',
            },
		},,
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
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/element': 'wp.element',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/components': 'wp.components',
        '@wordpress/plugins': 'wp.plugins',
        '@wordpress/edit-post': 'wp.editPost',
        '@wordpress/data': 'wp.data',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/api-fetch': 'wp.apiFetch',
        '@wordpress/url': 'wp.url',
	},
	// Webpack Aliases
	// <https://webpack.js.org/configuration/resolve/#resolve-alias>
	alias: {
		components: path.resolve( __dirname, 'blocks/_shared/components' ),
		styles: path.resolve( __dirname, 'node_modules/semantic-ui-css/components' ),
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
