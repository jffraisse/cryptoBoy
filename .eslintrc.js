// http://eslint.org/docs/user-guide/configuring

/*eslint linebreak-style: ["error", "windows"]*/

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "linebreak-style": 0,
    "prefer-template": 0,
    "radix": 0,
    "no-param-reassign": 0,
    "array-callback-return": 0,
    "no-plusplus": 0,
    "func-names": ["error", "as-needed"],
    'comma-dangle': [2, 'only-multiline'],
    "no-console": ["error", { allow: ["log"] }],
    'no-extra-parens': 0,
    'arrow-parens' : 0,
    'indent': 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
