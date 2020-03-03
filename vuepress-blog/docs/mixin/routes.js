function getMixinRoutes() {
  return [
    {
      title: '日常杂记',
      path: '/mixin/mixin-learning-and-summary', // 必须为绝对路径
      children: [
        ['/mixin/mixin-learning-and-summary/Run-Client-Of-iNode-Under-The-Ubuntu-System-perfectly', 'Ubuntu下完美安装运行校园网iNode客户端'],
        ['/mixin/mixin-learning-and-summary/Ubuntu16.04-And-Win10-Dual-System-Grub-Startup-Items-In-The-Solution-To-The-Disappearance-Of-Ubuntu-Options', 'Ubuntu16.04与win10双系统的Grub启动项中Ubuntu选项消失的解决']
      ]
    },
  ]
}

module.exports = getMixinRoutes