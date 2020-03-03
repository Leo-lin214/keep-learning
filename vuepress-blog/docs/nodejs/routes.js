function getNodejsRoutes() {
  return [
    {
      title: 'Nodejs 学习和总结',
      path: '/nodejs/nodejs-learning-and-summary', // 必须为绝对路径
      children: [
        ['/nodejs/nodejs-learning-and-summary/Express-Build-Architecture-Based-On-Node-And-Mongodb', '基于nodejs+mongodb使用express搭建项目架构'],
      ]
    },
  ]
}

module.exports = getNodejsRoutes