function getNetworkRoutes() {
  return [
    {
      title: 'Network 学习和总结',
      path: '/network/network-learning-and-summary', // 必须为绝对路径
      children: [
        ['/network/network-learning-and-summary/The-Basic-Knowledge-Of-Network', '《计算机网络》小总结'],
        ['/network/network-learning-and-summary/关于Nginx-你需要知道的点点滴滴', '关于Nginx-你需要知道的点点滴滴'],
        ['/network/network-learning-and-summary/HTTP', '瞧瞧 HTTP'],
        ['/network/network-learning-and-summary/TCP-IP', '瞧瞧 TCP-IP'],
        ['/network/network-learning-and-summary/如何科学上网', '如何科学上网'],
      ]
    },
  ]
}

module.exports = getNetworkRoutes