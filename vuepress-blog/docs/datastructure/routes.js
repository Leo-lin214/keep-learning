function getDatastructureRoutes() {
  return [
    {
      title: '数据结构学习和总结',
      path: '/datastructure/datastructure-learning-and-summary', // 必须为绝对路径
      children: [
        ['/datastructure/datastructure-learning-and-summary/前端中常见的算法题', '前端中常见的算法题'],
        ['/datastructure/datastructure-learning-and-summary/手写实现那回事', '手写实现那回事'],
        ['/datastructure/datastructure-learning-and-summary/Stack', '瞧瞧栈'],
        ['/datastructure/datastructure-learning-and-summary/Queue', '瞧瞧队列'],
        ['/datastructure/datastructure-learning-and-summary/LinkedList', '瞧瞧链表'],
        ['/datastructure/datastructure-learning-and-summary/Set', '瞧瞧集合'],
        ['/datastructure/datastructure-learning-and-summary/Dictionary', '瞧瞧表和哈希表'],
        ['/datastructure/datastructure-learning-and-summary/Tree', '瞧瞧树'],
        ['/datastructure/datastructure-learning-and-summary/ArraySort', '排序和搜索']
      ]
    },
  ]
}

module.exports = getDatastructureRoutes