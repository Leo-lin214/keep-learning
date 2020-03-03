# 你了解User-Agent吗？

在日常开发中，我们经常会通过 User-Agent 字段来判断是哪一个端，那么对于 User-Agent 究竟是一个什么东西？我们很少去细究，下面我就来简单阐述一下。

## User-Agent 定义

 - User-Agent  
   是一个特殊字符串头( 也被称为用户代理字符串 ), 被广泛用来表示浏览器客户端的信息, 使得服务器能识别客户机使用的操作系统和版本, CPU类型, 浏览器及版本, 浏览器的渲染引擎, 浏览器语言等;

 - 用户代理字符串包括 6 个不同部分: 

```javascript
    Mozilla/5.0(compatible;X11;U;Linux i686;en-US) Gecko/20081202 Firefox(Debian-2.0.0.19-0etch1);
    // Mozilla/5.0 浏览器标志: 包括应用名 Mozilla 和版本号 5.0 ;
    // compatible 浏览器兼容标志: 表示支持主要功能集 ;
    // U 加密标志: 该字段逐步被取消 ( N表示无安全加密, I表示弱安全加密, U表示强安全加密 ) ;
    // Linux i686 操作系统标志 ;
    // en-US 语言标志: 英文 ; 
    // Gecko/20081202 渲染引擎标志: 表示浏览器内核 ;
    // Firefox(Debian-2.0.0.19-0etch1) 浏览器版本信息: firefox ; 
```

 - 获取 User-Agent 值: 

   在 JS 中用 navgator.userAgent 获得 ;
  

## 各种设备的 User-Agent

 - Android 设备

   Nexus 5 4.4.2 1920*1080
   
   ```javascript
      Mozilla/5.0 (Linux; Android 4.4.2; Google Nexus 5 - 4.4.2 - API 19 - 1080x1920 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36
   ```
   
 - IOS 设备

    + iPhone

      ```javascript
        Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53
      ```
     
    + iPad
    
      ```javascript
        Mozilla/5.0 (iPad; CPU OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53
      ```
    

 - Mac 设备

    + Chrome

      ```javascript
        Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36
      ```
     
    + Safari
    
      ```javascript
        Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4
      ```
      
    + Firefox
    
      ```javascript
        Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:27.0) Gecko/20100101 Firefox/27.0
      ```
      
    + Maxthon
    
      ```javascript
        Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Maxthon/4.2.3
      ```
      

 - Windows 设备

   Windows 7 Chrome
   
   ```javascript
        Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36
   ```
   
   

## 判断用户的 User-Agent

 - 移动端

   ```javascript
    <script type="text/javascript">
        var browser = {
            versions:function(){ 
            var u = navigator.userAgent, app = navigator.appVersion; 
            return ;
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        } 
        console.log("语言版本: "+browser.language);
        console.log(" 是否为移动终端: "+browser.versions.mobile);
        console.log(" ios终端: "+browser.versions.ios);
        console.log(" android终端: "+browser.versions.android);
        console.log(" 是否为iPhone: "+browser.versions.iPhone);
        console.log(" 是否iPad: "+browser.versions.iPad);
        console.log(navigator.userAgent);
    </script>
   ```
   

 - PC 端

   ```javascript
    <script type="text/javascript">
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        if (window.ActiveXObject)
            Sys.ie = ua.match(/msie ([\d.]+)/)[1]
        else if (document.getBoxObjectFor)
            Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1]
        else if (window.MessageEvent && !document.getBoxObjectFor)
            Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1]
        else if (window.opera)
            Sys.opera = ua.match(/opera.([\d.]+)/)[1]
        else if (window.openDatabase)
            Sys.safari = ua.match(/version\/([\d.]+)/)[1];
        //以下进行测试
        if(Sys.ie) console.log('IE: '+Sys.ie);
        if(Sys.firefox) console.log('Firefox: '+Sys.firefox);
        if(Sys.chrome) console.log('Chrome: '+Sys.chrome);
        if(Sys.opera) console.log('Opera: '+Sys.opera);
        if(Sys.safari) console.log('Safari: '+Sys.safari);
    </script>
   ```