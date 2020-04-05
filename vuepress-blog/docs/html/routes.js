function getHtmlRoutes() {
  return [
    {
      title: 'Html 学习和总结',
      path: '/html/html-learning-and-summary', // 必须为绝对路径
      children: [
        ['/html/html-learning-and-summary/聊聊前端常见的存储方式', '聊聊前端常见的存储方式'],
        ['/html/html-learning-and-summary/In-Depth-Understanding-HTML-Meta-Tag', '深入了解meta标签'],
        ['/html/html-learning-and-summary/How-Browser-Work', '浏览器是如何工作的'],
        ['/html/html-learning-and-summary/Chat-With-Cookies', '聊聊Cookie'],
        ['/html/html-learning-and-summary/Understand-The-Routing-In-The-Web', 'Web中的路由'],
        ['/html/html-learning-and-summary/Understanding-User-Agent-In-Depth', '你了解User-agent吗？'],
      ]
    },
  ]
}

module.exports = getHtmlRoutes