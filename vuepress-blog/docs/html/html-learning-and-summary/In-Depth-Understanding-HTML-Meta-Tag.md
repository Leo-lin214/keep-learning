# 深入了解meta标签

　 首先，我们要先知道meta标签使用来干嘛的，meta标签主要作用就是设置关键字，来帮助你所设计各大搜索引擎访问，提高网站的访问量.另外meta还有动画，定义语言，刷新页面，处理缓冲等功能.
　 meta标签总共有两个属性，分别是http-equiv属性和name属性，而且不同的属性又有不同的参数值，不同的参数值又会产生不同效果:

## name属性
　 name属性主要是用于描述网页，对应着content属性，content中的内容主要是便于搜索引擎机器人查找信息和分类信息用的，格式如下:


```html
<meta name="参数" content="具体的参数值">
```
　 name属性主要包含以下参数:
 xiugai

 1. #### Description(用于对网页内容的描述)
 
    + 说明: description就是告诉搜索引擎你的网站的主要内容;
    + 例子:

    ```html
    <meta name="description" content="HelloWorld">
    ```  
 
 2. #### Keywords(关键字)
 
    - 说明: keywords用来告诉搜索引擎你网页的关键字是什么;
    - 例子: 

    ```html
    <meta name="Keywords" content="网页设置，网页教程">
    ```

 3. #### Author(作者)
 
    - 说明: 标明网页的作者;
    - 例子: 

    ```html
    <meta name="author" content="***">
    ```

 4. #### Viewpoint(兼容不同设备)
 
    - 说明: 在不定义viewpoint的情况下，页面的宽度以屏幕分辨率为基准，在设置后，会根据设备宽度来调整页面，达到适配终端大小的效果;
    - 主要有以下属性:
        + width: 控制viewpoint的宽度，可以是固定值，也可以是device-width，即设备的宽度;
        + height: 控制viewpoint的高度，可以是固定值，也可以是device-height，即设备的高度;
        + initial-scale: 控制初始化缩放比例，1.0表示不可以缩放;
        + maximum-scale: 控制viewpoint的最大缩放比例;
        + minimum-scale: 控制viewpoint的最小缩放比例;
    - 例子: 

    ```html
    <meta name="viewpoint" content="width=device-width， initial-scale=1.0">
    ```
　 




## http-equiv属性
　 htttp-equiv相当于http文件头作用，可以向浏览器传回一些有用的信息，帮助正确和精确地显示网页内容，对应着content，content中包含参数的值，格式:

```html
<meta http-equiv="参数" content="参数的值">        
```
　 http-equiv属性主要包含以下参数:

 1. #### Expires(期限)
    - 说明: 可以用与设定网页的到期时间，一旦网页过期，必须到服务器上重新传输，即重新获取数据;
    - 例子: 

    ```html
    <meta http-equiv="expires" content="Tue， 1 Jul 2017 16:12:18 GMT">       //必须要使用GMT的时间格式
    ```

 2. #### Pragma(处理缓存问题)
    - 说明: 禁止浏览器从本地计算机的缓存中访问页面内容;
    - 例子: 
    
    ```html
    <meta http-equiv="Pragma" content="no-cache">     //这样设定，访问者将无法脱机浏览
    ```
    
 3. #### Refresh(刷新)
    - 说明: 自动刷新并指向新页面;
    - 例子: 
    
    ```html
    <meta http-equiv="Refresh" content="2; URL=https://www.baidu.com/">    //其中的2表示停留2秒后自动刷新到URL网址
    ```
    
 4. #### Set-Cookie(cookie设定)
    - 说明: 如果网页过期，那么存盘的cookie将被删除;
    - 例子: 
    
    ```html
    <meta http-equiv="Set-Cookie" content="cookievalue=***; expires=Tue， 1 Jul 2017 16:12:18 GMT; path=/">       //必须要使用GMT时间格式
    ```

 5. #### Window-target(显示窗口的设定)
    - 说明: 强制页面在当前窗口以独立页面显示，即防止别人在框架里调用自己的页面;
    - 例子: 
    
    ```html
    <meta http-equiv="Window-target" content="_top">
    ```
    
 6. #### content-Type(显示字符集的设定)
    - 说明: 设定页面使用的字符集;
    - 例子: 
    
    ```html
    <meta http-equiv="content-Type" content="text/html; charset=gb2312">
    ```
    
 7. #### X-UA-Compatible(指定标准渲染)
    - 说明: 强制浏览器按照特定的版本标准进行标准，但不支持IE7及其以下版本;
    - 常用属性有: 
        
        + IE=Edge: 强制浏览器按照最新的标准去渲染，但也可能由于没有固定的版本而破坏你的布局;
        + chrome=1: 将允许站点在使用了谷歌浏览器内嵌框架的客户端渲染，对于没有使用的，则没有任何影响;
        + IE=EmulateIE7: 最常用的作为IE8兼容的方法;
    - 例子: 
    
    ```html
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
    ```




  



 8. #### Page-Enter，Page-Exit

    - 说明: 设定进入页面和离开页面时的特殊动画效果;
    - Duration的值为网页动态过渡的时间，单位为秒。  
Transition是过渡方式，它的值为0到23，分别对应24种过渡方式。如下表：  
        + 0    盒状收缩    1    盒状放射  
        + 2    圆形收缩    3    圆形放射  
        + 4    由下往上    5    由上往下  
        + 6    从左至右    7    从右至左  
        + 8    垂直百叶窗    9    水平百叶窗  
        + 10    水平格状百叶窗    11垂直格状百叶窗  
        + 12    随意溶解    13从左右两端向中间展开  
        + 14从中间向左右两端展开    15从上下两端向中间展开  
        + 16从中间向上下两端展开    17    从右上角向左下角展开  
        + 18    从右下角向左上角展开    19    从左上角向右下角展开  
        + 20    从左下角向右上角展开    21    水平线状展开  
        + 22    垂直线状展开    23    随机产生一种过渡方式  
    - 例子: 
    
    ```html
    <meta http-equiv="Page-Enter" content="revealtrans(duration=6.0， transition=23)">
    <meta http-equiv="Page-Exit" content="revealtrans(duration=6.0， transition=23)">
    ```
