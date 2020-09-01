const { chalk } = require('@vue/cli-shared-utils');
const lint = require('../lint');

module.exports = (api, options = {}) => {
  const { overwriteConfig } = options;
  if (overwriteConfig === 'abort') {
    api.exitLog(chalk`{yellow Plugin setup successfully cancelled}`, 'warn');
    return;
  }

  let { lintStyleOn = [] } = options;
  if (typeof lintStyleOn === 'string') {
    lintStyleOn = lintStyleOn.split(',');
  }

  const pkg = {
    scripts: {
      'lint:style': 'vue-cli-service lint:style',
    },
    devDependencies: {
      stylelint: '^13.0.0',
    },
    vue: {
      pluginOptions: {
        lintStyleOnBuild: lintStyleOn.includes('build'),
        stylelint: {},
      },
    },
    stylelint: {
      root: true,
      extends: [],
    },
  };

  const { config } = options;

  if (config === 'standard') {
    pkg.stylelint.extends.push('stylelint-config-standard');
    Object.assign(pkg.devDependencies, {
      'stylelint-config-standard': '^20.0.0',
    });
  } else if (config === 'primer') {
    pkg.stylelint.extends.push('stylelint-config-primer');
    Object.assign(pkg.devDependencies, {
      'stylelint-config-primer': '^9.0.0',
    });
  } else if (config === 'prettier') {
    pkg.stylelint.extends.push('stylelint-config-standard');
    pkg.stylelint.extends.push('stylelint-prettier/recommended');
    Object.assign(pkg.devDependencies, {
      'stylelint-config-standard': '^20.0.0',
      'stylelint-config-prettier': '^8.0.1',
      'stylelint-prettier': '^1.1.2',
      prettier: '^1.19.1',
    });
  } else if (config === 'kanbaru') {
    pkg.stylelint.extends.push('@ascendancyy/stylelint-config-kanbaru');
    Object.assign(pkg.devDependencies, {
      '@ascendancyy/stylelint-config-kanbaru': '^2.0.0',
    });
  }  else if (config === 'scss') {
    pkg.stylelint.extends.push('stylelint-config-recommended-scss');
    Object.assign(pkg.devDependencies, {
      'stylelint-config-recommended-scss': '^4.2.0',
    });
  }

  if (lintStyleOn.includes('commit')) {
    Object.assign(pkg.devDependencies, {
      'lint-staged': '^10.0.0',
    });
    pkg.gitHooks = {
      'pre-commit': 'lint-staged',
    };
    pkg['lint-staged'] = {
      '*.{vue,htm,html,css,sss,less,scss}': ['vue-cli-service lint:style', 'git add'],
    };
  }

  api.render('./template');
  api.addConfigTransform('stylelint', {
    file: {
      js: ['.stylelintrc.js', 'stylelint.config.js'],
      json: ['.stylelintrc', '.stylelintrc.json'],
      yaml: ['.stylelintrc.yaml', '.stylelintrc.yml'],
    },
  });
  api.extendPackage(pkg);
};
