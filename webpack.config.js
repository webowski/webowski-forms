import defaultConfig from '@wordpress/scripts/config/webpack.config.js'
import Tailwindcss from '@tailwindcss/postcss'

// Get postcss-loader
const webpackRulesArray = defaultConfig.module.rules
const testCSSRuleObject = webpackRulesArray.find((rule) => {
	return rule.test?.toString().includes('sc|sa)ss')
})
const postCSSLoaderObject = testCSSRuleObject.use.find((use) => {
	return use.loader?.includes('postcss-loader')
})

// PostCSS plugins
postCSSLoaderObject.options.postcssOptions = postCSSLoaderObject.options.postcssOptions || {}
postCSSLoaderObject.options.postcssOptions.plugins = postCSSLoaderObject.options.postcssOptions.plugins || []
postCSSLoaderObject.options.postcssOptions.plugins.push(
	Tailwindcss()
)

defaultConfig.plugins.push({
	apply: (compiler) => {
		compiler.hooks.watchRun.tapAsync('LogChangedFilesPlugin', (compilation, callback) => {
			const changedFiles = compilation.modifiedFiles || compilation.fileTimestamps?.keys?.() || [];
			if (changedFiles && changedFiles.size > 0) {
				console.log('\x1b[33m%s\x1b[0m', '→ Files which caused rebuild:');
				for (const file of changedFiles) {
					console.log('   ', file);
				}
			}
			callback();
		});
	}
});

defaultConfig.watchOptions = {
	...defaultConfig.watchOptions,
	ignored: ['**/build/**'],
};

export default defaultConfig
