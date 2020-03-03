function getWebpackRoutes() {
  return [
    {
      title: 'Webpack 学习和总结',
      path: '/webpack/webpack-learning-and-summary', // 必须为绝对路径
      children: [
        ['/webpack/webpack-learning-and-summary/Webpack究竟是如何运行的', 'Webpack究竟是如何运行的'],
        ['/webpack/webpack-learning-and-summary/Webpack优化--构建速度篇', 'Webpack优化--构建速度篇'],
        ['/webpack/webpack-learning-and-summary/Webpack优化--开发体验篇', 'Webpack优化--开发体验篇'],
        ['/webpack/webpack-learning-and-summary/Webpack优化--输出质量篇', 'Webpack优化--输出质量篇'],
        ['/webpack/webpack-learning-and-summary/Webpack之模块化优化', 'Webpack之模块化优化'],
      ]
    },
  ]
}

module.exports = getWebpackRoutes