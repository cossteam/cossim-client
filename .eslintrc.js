module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	ignorePatterns: ['dist', '.eslintrc.js', 'electron'],
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
		// 禁止使用未定义的 propType
		'react/prop-types': 'error',
		'no-async-promise-executor': 'off',
		'no-extra-semi': 'off',
		"eslint/no-var-requires": "off",
		"no-undef": [
			"error",
			{
				"typeof": true
			}
		]
	}
}
