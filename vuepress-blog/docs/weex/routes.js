function getWeexRoutes() {
  return [
    {
      title: 'Weex 学习和总结',
      path: '/weex/weex-learning-and-summary', // 必须为绝对路径
      children: [
        ['/weex/weex-learning-and-summary/开发环境基本配置', 'Weex 开发环境基本配置'],
        ['/weex/weex-learning-and-summary/weex全局变量和通信机制', 'Weex 全局变量和通信机制']
      ]
    },
  ]
}

module.exports = getWeexRoutes