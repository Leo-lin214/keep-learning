function getCSSRoutes() {
  return [
    {
      title: 'CSS 学习和总结',
      path: '/css/css-learning-and-summary', // 必须为绝对路径
      children: [
        ['/css/css-learning-and-summary/On-The-Layout-Of-Bs2-And-Bs3', '浅谈Bootstrap2和Bootstrap3的布局'],
        ['/css/css-learning-and-summary/Talking-About-The-Method-Of-Clearing-Floating-In-CSS', 'CSS中清除浮动的方法'],
        ['/css/css-learning-and-summary/Sum-Up-CSS-Horizontal-And-Vertical-Center', 'CSS的水平居中和垂直居中'],
      ]
    },
  ]
}

module.exports = getCSSRoutes