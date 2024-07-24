module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost:5173/index.html'],
    },
    assert: {
      preset: "lighthouse:recommended",
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-results",  // 결과가 저장될 디렉토리
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%"
    },
  },
};