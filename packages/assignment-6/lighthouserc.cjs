module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.5 }],
        'categories:best-practices': ['warn', { minScore: 0.5 }],
        'categories:seo': ['warn', { minScore: 0.5 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-results",  // 결과가 저장될 디렉토리
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%"
    },
  },
};