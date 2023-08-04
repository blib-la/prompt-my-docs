export const minifyConfig = {
	compress: {
		dead_code: true,
		drop_console: true,
		drop_debugger: true,
		keep_classnames: false,
		keep_fargs: true,
		keep_fnames: false,
		keep_infinity: false,
	},
	mangle: false,
	module: true,
	sourceMap: false,
	output: {
		comments: false,
	},
};
