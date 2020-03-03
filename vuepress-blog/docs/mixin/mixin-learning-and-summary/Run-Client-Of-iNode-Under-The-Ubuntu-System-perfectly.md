# Ubuntu下完美安装运行校园网iNode客户端

在Linux Ubuntu系统下安装校园网iNode客户端， 可谓是一大难题， 各种报错令人眼花缭乱， 不知所措， 经过本人一两天的煎熬， 终于找出了解决方法， 于是就在本文跟有需要的同学分享一下（普遍的Ubuntu版本都能使用该方法， 本人的Ubuntu版本是15.0.4）, 步骤如下: 

## 首先先下载iNode客户端安装包

打开下面链接, 先下载iNode客户端安装包: 

链接: http://pan.baidu.com/s/1c25DEEk 密码: hekg


## 创建iNode目录

下载iNode客户端安装包后, 打开控制台(terminal)。
创建目录时, 谨记要在home目录下创建(找不到home目录的话, 可以点击computer目录并在里面找出home目录), 而且还需要使用root用户, 命令如下:

```bash
$ sudo mkdir /home/iNode
```

## 移动iNode客户端安装包到iNode里面

移动时, 记得使用root用户权限, 命令如下: 

```bash
$ sudo cp Linux_iNodeClient.tar.gz /home/iNode
```

## 解压iNode客户端安装包到iNode目录下

命令如下:

```bash
$ cd /home/iNode                    //进入iNode目录
$ tar -zxvf Linux_iNodeClient.tar.gz            //解压iNode客户端安装包
```


## 进入iNodeClient目录并运行安装文件

命令如下: 

```bash
$ cd iNodeClient                    //进入iNodeClient目录
//运行安装文件
$ sudo ./install.sh
```

运行安装文件之后, 一般会出现: 

```bash
Starting Authenngervice：OK
```


按照以上的步骤一般都不会出现任何问题, 除非你并不是使用我的iNode安装包, 否则可能会出现一些问题


## 安装好之后, 有些同学会发现双击iNodeCLient图标, 没有任何的反应, 这时候就需要建立链接

使用如下命令进入 /usr/lib/i386-linux-gnu目录:

```bash
$ cd /usr/lib/i386-linux-gnu/
```

进入目录后, 需要查看一下库文件, 使用如下命令: 

```bash
$ ls -l | less
```

进去后, 找到如下指令: 

```bash

lrwxrwxrwx 1 root root       13  5月 12 18:30 libjpeg.so.8 -> libjpeg.so.62
-rw-r--r-- 1 root root   300776 12月 20  2013 libjpeg.so.8.0.2

lrwxrwxrwx 1 root root       16  4月  2  2015 libtiff.so.5 -> libtiff.so.5.2.0
-rw-r--r-- 1 root root   496652  4月  2  2015 libtiff.so.5.2.0


```

你可以不需要管这四行代码是什么用的, 它们只是一个动态链接的指向, 这时候我们会找出了两个重要的文件 libjpeg.so.8.0.2 和 libtiff.so.5.2.0 ,现在可以去创建链接: 

```bash
//需要把libjpeg.so.8.0.2指向链接libjpeg.so.62
$ sudo ln -s libjpeg.so.8.0.2 libjpeg.so.62
```

这时候, 也需要你会报如下错误: 

```bash
ln: failed to create symbolic link ‘libjpeg.so.62’: File exists
```

解决这个错误的方法就是: 把原有的libjpeg.so.62删除, 命令如下

```bash
$ sudo rm libjpeg.so.62
//删除libjpeg.so.62后, 再创建链接就可以完美解决, 并不会报任何错误
$ sudo ln -s libjpeg.so.8.0.2 libjpeg.so.62
```

同样, 也要把libtiff.so.5.2.0建立链接

```bash
$ sudo ln -s libtiff.so.5.2.0 libjpeg.so.3
```

如果还是报上述错误时, 还是用删除libjpeg.so.3方法, 再创建链接即可


好了, 到这里, 你会发现点击iNodeClient图标, 会弹出一个框出来啦, 哈哈, 你就可以登陆你的学号上网了


另外, 如果使用一段时间后, 双击又没反应了, 这时候你可以选择重新安装, 或者选择重新建立链接都可以解决