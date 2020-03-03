# Ubuntu16.04与win10双系统的Grub启动项中Ubuntu选项消失的解决

纯粹是对于校园网的一些解决记录，当然这也耗费了我很多时间哈哈。

## 本人遇到的问题

我的电脑是Ubuntu16.04与win10双系统，一开始都是很正常显示Grub启动项的，一切都是很正常显示，然而，用了一段时间后，有一天惊奇地发现Grub启动项中只有仅仅的windows系统，而原来的Ubuntu系统却消失了，本人也是寻找各种解决方法，最终也把问题进行了解决，因此也分享一下如何处理。

## 首要的准备

一个已经刻录好Ubuntu系统的U盘即可

## 开始

 1. 插入U盘，重启电脑，然后选择U盘启动;
 2. 选择**Try Ubuntu**进入Ubuntu系统;
 3. 在Ubuntu系统打开终端，依次执行如下操作：

   ```javascript
        sudo fdisk -l
   ```
   执行这个命令后，你会看到如下图所示：
   
   ![](http://7xs89l.com1.z0.glb.clouddn.com/2017-11-03%2015-53-52%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE.png)
   
   每个人都选择曾经自己创建的boot分区即可，本人电脑由于boot分区是在sda8中，因此接着执行如下操作：
   
   ```javascript
        sudo mount /dev/sda8 /mnt
   ```
   
   接着继续执行操作：
   
   ```javascript
        sudo grub-install --root-directory=/mnt /dev/sda
   ```
   
   执行完后，如果出现```No error reported.```，那就证明成功了
   
 4. 如果执行完以上操作后，紧接着就是重启电脑即可，重启电脑后，如无意外的话，Grub这时候就是会正常显示出Ubuntu系统和win10系统的了，这时候还是不要进入windows系统，先进入Ubuntu系统，然后继续打开终端输入如下命令：
 
    ```javascript
        sudo update-grub
    ```
    
    这时候，Grub会被正常地修复了
    
    
## 意外的大坑

也许很多同学使用了以上的方法后都会很正常地修复了Grub启动项，然而也会有部分人遇到一些错误，而本人也恰恰遇到了这个大坑，那就是重启电脑会发现，电脑没有启动项，却只有```Minimal BASH-like line editings supported```的命令行界面，如下：

```javascript
    Minimal BASH-like line editing is supported.For the first word.TAB lists possible command completions.Anywhere else TAB lists possible device or file completions.
    
    grub>
```

不要着急，下面就分享一下处理方法：

 1. 依然还是插入那个刻有Ubuntu系统的U盘，选择U盘启动后，接着选择**Try Ubuntu**，需要注意的是，**一定要链接到网络**;
 2. 依然打开终端，然后执行如下操作：
 
    ```javascript
        sudo add-apt-repository ppa:yannubuntu/boot-repair
        sudo apt-get update
        sudo apt-get install boot-repair
    ```
    
    执行完以上操作后，就可以安装了boot repair这个软件了;
    
    
 3. 接着就是打开Dash，输入boot-repair，打开它后，选择**recommanded repair**按钮，接下来就按照提示修复即可，过程可能需要一点时间，只需要耐心等待即可;
 4. 结束后，重启电脑，你就会发现这时候终于由Grub选项了！！！但是只有Ubuntu系统，却没有win10系统;
 5. 接着就选择Ubuntu系统，进入到自己曾经的Ubuntu系统以后，打开终端，输入以下命令：
 
    ```javascript
        sudo update-grub
    ```
    
    
 6. 好了，执行完以上的命令后，再次重启电脑，这时候你就会发现Grub启动项一切终于都正常了起来，有了Ubuntu系统和windows系统选择
 
至此，一切问题都得到了解决。