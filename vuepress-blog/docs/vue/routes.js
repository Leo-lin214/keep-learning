function getVueRoutes() {
  return [
    {
      title: 'Vue 学习和总结',
      path: '/vue/', // 必须为绝对路径
    },
    {
      title: 'Vue 源码的探究和学习',
      path: '/vue/vue-source-explporation/',
      children: [
        ['/vue/vue-source-explporation/【 Vue 源码分析 】数据初始化之响应式探究（上）', '1. 数据初始化之响应式探究（上）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】数据初始化之响应式探究（下）', '2. 数据初始化之响应式探究（下）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】数据初始化之依赖收集（上）', '3. 数据初始化之依赖收集（上）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】数据初始化之依赖收集（下）', '4. 数据初始化之依赖收集（下）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】数据初始化之依赖更新', '5. 数据初始化之依赖更新'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】为什么不推荐使用 $forceUpdate', '6. 为什么不推荐使用 $forceUpdate'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】计算属性 Computed', '7. 计算属性 Computed'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】侦听器 Watch', '8. 侦听器 Watch'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】方法 Methods', '9. 方法 Methods'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】运行机制之 Props', '10. 运行机制之 Props'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】混合 Mixin（上）', '11. 混合 Mixin（上）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】混合 Mixin（下）', '12. 混合 Mixin（下）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】生命周期 Lifecycle', '13. 生命周期 Lifecycle'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】异步更新队列之 NextTick', '14. 异步更新队列之 NextTick'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】从 Template 到 DOM 过程是怎样的', '15. 从 Template 到 DOM 过程是怎样的'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】编译 Compile（上）', '16. 编译 Compile（上）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】编译 Compile（下）', '17. 编译 Compile（下）'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】渲染 Render', '18. 渲染 Render (AST -> VNode)'],
        ['/vue/vue-source-explporation/【 Vue 源码分析 】如何在更新 Patch 中进行 Diff', '19. 如何在更新 Patch 中进行 Diff']
      ]
    }
  ]
}

module.exports = getVueRoutes