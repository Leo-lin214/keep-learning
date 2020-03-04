function getReactRoutes() {
  return [
    {
      title: 'React 学习和总结',
      path: '/react/react-learning-and-summary', // 必须为绝对路径
      children: [
        ['/react/react-learning-and-summary/About-React-Render-And-Update', '个人见解之 React 渲染与更新'],
        ['/react/react-learning-and-summary/React-Summary', 'React 知识点总结'],
      ]
    },
  ]
}

module.exports = getReactRoutes