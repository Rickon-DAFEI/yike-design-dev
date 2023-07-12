module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'style', 'test'],
    ],
    'header-max-length': [2, 'always', 72],
    'subject-case': [0],
    'subject-empty': [0],
    'scope-empty': [0],
    'type-case': [0],
    'type-empty': [0],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'style', 'test'],
    ],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 72],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 72],
    'subject-full-stop': [0, 'never'],
    'subject-min-length': [0],
    'subject-max-length': [0],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)\(([\w-]+)\):\s(.+)$/,
      headerCorrespondence: ['type', 'component', 'commitWord'],
    },
  },
  formatter: '@commitlint/format',
}
