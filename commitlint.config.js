export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // Accept both "feat: title" and "add title" formats.
      headerPattern: /^(\w+)(?:\(([^)]+)\))?:?\s(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'add',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case']],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
}
