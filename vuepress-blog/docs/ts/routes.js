function getTypescriptRoutes() {
  return [
    {
      title: 'Typescript 学习和总结',
      path: '/ts/ts-learning-and-summary', // 必须为绝对路径
      children: [
        ['/ts/ts-learning-and-summary/Typescript-Base', 'Typescript 知识点总结']
      ]
    },
  ]
}

module.exports = getTypescriptRoutes