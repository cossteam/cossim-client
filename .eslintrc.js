/*eslint no-undef: "off"*/
module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.src/**/*.{js,cjs}'],
			parserOptions: {
				sourceType: 'module'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react'],
	rules: {
		// 未使用变量
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				caughtErrors: 'all'
			}
		],
		'react/prop-types': 'off'
	}
}
