# 基于nodejs+mongodb使用express搭建项目架构

以下就express和mongodb结合实践，来实现一个简易的项目结构。

## 准备工作
　　这里只介绍linux下的操作.

　　首先,在安装npm管理包的情况下,分别全局安装express,mongodb,命令如下:
　 

```bash
  > sudo npm install-g express     //express
  > sudo apt-get install -y mongodb-org    //mongodb
```

## 用express创建一个项目的框架

- 先创建一个名字叫Test的项目文件夹名,默认使用jade模板
 
  ```bash
    //默认为jade模板
    > express Test
    
    //如果想用ejs模板引擎,则
    > express -e Test
  ```
 　效果图:
 　![](http://7xs89l.com1.z0.glb.clouddn.com/linuxFile.png)


  - 进入项目中Test,然后安装项目所依赖的包(安装时是根据package.json文件)

    ```bash
      //进入Test项目
      > cd Test
      
      //安装所需的依赖包
      > npm install
    ```
 
  
 - 安装依赖包成功后,就可以启动项目了
 
  ```bash
    //启动项目
    > node app
  ```
　成功启动后,控制台会光标会一直在闪,默认为3000端口.如果在浏览器上打上```localhost:3000//```后不能正常显示页面的时候,就在app.js中```module.exports=app```;语句之前添加```app.listen(3000)```;

　效果图:
　![](http://7xs89l.com1.z0.glb.clouddn.com/howtoexpress.png)
　

## 创建数据库


- 安装好mongodb后,先进入数据库指令控制台
 
  ```bash
    > mongo
  ```

- 创建数据库
 
  ```bash
    > use Test
  ```

- 使用集合users,并插入数据

  ```bash
    > db.users.insert({name:'root',password:'root'})
  ```

- 在项目根目录下创建一个database文件夹,然后在里面再创建一个db.js,而且db.js内容如下

  ```javascript
    // Import Package Mongoose 
    var mongoose = require('mongoose');

    // 连接数据库
    var db = mongoose.connect('mongodb://localhost/Test');

    // 创建模型
    var Schema = mongoose.Schema;   

    //  定义了一个新的模型，但是此模式还未和users集合有关联
    var userScheMa = new Schema({
      name: String,
      password: String
    }); 

    //  与users集合关联
    exports.user = db.model('users', userScheMa); 
  ```


## 在views文件夹中创建页面jade

 1. layout.jade(布局)

    ```javascript
    doctype html
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
      body
        block content
    ```
 2. index.jade(首页)

    ```javascript
    extends layout
    
    block content
    	h1 HelloWorld
    	p Welcome to #{title}
    	p
    		a(href="login") 登陆	
    ```
    效果图:
    ![](http://7xs89l.com1.z0.glb.clouddn.com/howtoexpressindex.png)

 3. login.jade(登陆页面)

    ```javascript
    extends layout
    
    block content
    	h1 	Hello World
    	p 	Welcome to #{title}
    	form(action="/ucenter",method="post")
    		p
    			span	name:
    			br
    			input#name(name="name",type="text")
    		p
    			span	password:
    			br
    			input#password(name="password",type="password")
    		p 	
    			input(type="submit" value="submit")
    ```
    效果图:
    ![](http://7xs89l.com1.z0.glb.clouddn.com/howtoexpresslogin.png)
    
 4. main.jade(登陆后的页面)
 
    ```javascript
    extends layout

    block content
    	h1 	hello Word
    	p 	Welcome to #{title}
    	p	你已经成功登陆
    ```
    效果图:
    ![](http://7xs89l.com1.z0.glb.clouddn.com/howtoexpressmain.png)
    


## 最后一步,路由的控制(即routes文件中index.js)

　　index.js文件代码如下:

```javascript
var express = require('express');
var router = express.Router();
var user = require('../database/db').user;


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'index' });
});

/* login */
router.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
});

/* main */
router.post('/ucenter', function(req, res) {
  var query = {"name": req.body.name, "password": req.body.password};
  (function(){
		  user.count(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
				console.log(doc)
				if(doc == 1){
					console.log(query.name + ": 登陆成功 " + new Date());
					res.render('ucenter', { title:'main' });
				}else{
  				console.log(query.name + ": 登陆失败 " + new Date());
  				res.redirect('/');
			 }
	    });
  })(query);
 });

module.exports = router;
```
