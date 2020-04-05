const getVueRoutes = require('./../vue/routes')
const getWebpackRoutes = require('./../webpack/routes')
const getJavaScriptRoutes = require('./../javascript/routes')
const getHtmlRoutes = require('./../html/routes')
const getCSSRoutes = require('./../css/routes')
const getNodejsRoutes = require('./../nodejs/routes')
const getMixinRoutes = require('./../mixin/routes')
const getReactRoutes = require('./../react/routes')
const getNetworkRoutes = require('./../network/routes')
const getDatastructureRoutes = require('./../datastructure/routes')
const getTypescriptRoutes = require('./../ts/routes')
const getWeexRoutes = require('./../weex/routes')

module.exports = {
  base: '/',
  // title: 'Learing And Sharing',
  description: '好好学习，天天向上💪',
  themeConfig: {
    logo: '/icon.png',
    nav: [
      { text: '主页', link: '/' },
      {
        text: '技术分享',
        items: [
          { text: 'JavaScript', link: '/javascript/javascript-learning-and-summary/' },
          { text: 'HTML', link: '/html/html-learning-and-summary/' },
          { text: 'CSS', link: '/css/css-learning-and-summary/' },
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/react/' },
          { text: 'Webpack', link: '/webpack/webpack-learning-and-summary/' },
          { text: 'Typescript', link: '/ts/ts-learning-and-summary/' },
          { text: 'Nodejs', link: '/nodejs/nodejs-learning-and-summary/' },
          { text: 'Weex', link: '/weex/weex-learning-and-summary/' },
          { text: 'Network', link: '/network/network-learning-and-summary/' },
          { text: '数据结构', link: '/datastructure/datastructure-learning-and-summary/' },
          { text: '日常杂记', link: '/mixin/mixin-learning-and-summary/' },
        ]
      },
      { text: 'Github', link: 'https://github.com/Andraw-lin' },
    ],
    sidebar: {
      '/vue/': getVueRoutes(), // 获取Vue页面路由
      '/react/': getReactRoutes(), // 获取React页面路由
      '/webpack/': getWebpackRoutes(), // 获取Webpack页面路由
      '/javascript/': getJavaScriptRoutes(), // 获取JavaScript页面路由
      '/html/': getHtmlRoutes(), // 获取HTML页面路由
      '/css/': getCSSRoutes(), // 获取CSS页面路由
      '/nodejs/': getNodejsRoutes(), // 获取nodejs页面路由
      '/datastructure/': getDatastructureRoutes(), 
      '/network/': getNetworkRoutes(), // 获取Network页面路由
      '/ts/': getTypescriptRoutes(), // 获取Typescript页面路由
      '/weex/': getWeexRoutes(), // 获取Weex页面路由
      '/mixin/': getMixinRoutes(), // 获取杂记页面路由
    }
  }
}