---
layout: post
category: Andraw-lin
title: Some CSS Summary In << CSS The Definitive Guide >>
summary: Some CSS Summary In << CSS The Definitive Guide >>
---

## **Some CSS Summary In << CSS The Definitive Guide >>(To Be Continue)**

- [(一) CSS和文档](#css)
- [(二) 选择器](#section)
- [(三) 结构与层叠](#section-1)
- [(四) 字体和文本属性](#section-2)
- [(五) 基本视觉格式化](#section-3)

### (一) CSS和文档

  1. 元素

     - 替换元素: 是指用来替换元素内容部分并非由文档内容直接表示,例如img,表单input元素(替换元素一般相对比较小);
     - img元素中,当src不指向任何外部地址的时候,不占任何地方;
     - 非替换元素: 大多数html和xhtml元素都是非替换元素;
     - 替换元素可以是块级元素,不过通常不是;
     - 在html和xhtml中,块级元素不能继承行内元素(即不能嵌套在行内元素中);
     - html中插入css方法: link标记,style元素,@import指令,内联样式;

### (二) 选择器

  1. 规则结构

     - css规则都有两个基本部分: 选择器和声明块;
    ##2.伪类和为元素
     - css定义4个伪元素: 设置首字母样式,设置第一行样式,设置之前和之后元素的样式;

### (三) 结构与层叠

  1. 特殊性
     - 对于选择器中给定的各个ID属性值,加0,1,0,0;
     - 对于选择器中给定的各个类属性值,属性选择或伪类,加0,0,1,0;
     - 对于选择器中给定的各个元素和伪元素,加0,0,0,1;
     - 结合符和通配选择器对特殊性没有任何的贡献,但通配选择器属于0特殊性,而结合符选择器没有任何的特殊性(注意: 0特殊性比没有特殊性的优先级要高);
     - 一般地,内联样式的特殊性为: 1,0,0,0(即在相对应的元素里面加上style属性);

  2. 重要性
     - 在css相对应的属性的后面加上!important,在与相同名字的属性混合的时候,带有!important的属性优先选择;
     - 注意,带有!important的css属性的特殊性比内联样式的特殊性要高;

  3. 继承
     - 一般地,大多数框模型属性(比如内外边距,背景和边框)都不能继承;
     - 继承没有任何的特殊性!!!例如:
     ``*{color: gray;}``
     ``h1#page-title{color: black;}``
     ``<h1>Meerkat  <em>Central</em></h1>``
     ``<p>HelloWord</p>``
     在这段代码里面,Meerkat会依然继承h1的属性,即显示黑色,而Central则会显示灰色,因为通配选择器有0特殊性,继承则没有特殊性,因此0特殊性要比没特殊性要强

### (四) 字体和文本属性

  1. 字体

     - font-family: 用于所有元素,有继承性,初始值由用户代理指定;
     - font-weight: 值有:normal,bold,bolder,lighter,100-900,inherit,用于所有元素,有继承性,初始值为normal;
     - font-size: 值有:xx-small,x-small,small,medium,large,x-large,xx-large,smaller,larger,<length>,<percentage>,inherit,用于所有元素,有继承性,初始值为medium;
     - font-style: 值有italic,oblique,normal,inherit,用于所有元素,有继承性,初始值为normal;
     - font-variant(字体变形): 值有small-caps,normal,inherit,用于所有元素,有继承性,初始值为normal;
     - font: 
       值有font-style || font-variant || font-weight(这三个可有可无,值的顺序随便) || font-size/line-height || font-family(size和family一定要出现,size一定要在family前面,size后面跟有line-height时一定要/符号);

  2. 文本
     - text-indent(文本缩进): 值有<length>,<percentage>,inherit,应用于块级元素,有继承性,初始值为0;
     - text-align: 值有left,center,right,justify,inherit,只用于块级元素,有继承性,初始值由用户代理决定;
     - line-height: 值有<length>,<percentage>,<number>,normal,inherit,应用于所有元素,有继承性,初始值为normal;
     - vertical-align: 值有baseline,sub,super,top,text-top,middle,bottom,text-bottom,<percentage>,<length>,inherit,只用于行内元素和表格元素,无继承性,初始值为baseline;
     - word-spacing(字间隔): 值有<length>,normal,inherit,应用于所有元素,有继承性,初始值为normal;
     - letter-spacing(字母间隔): 值有<length>,normal,inherit,应用于所有元素,有继承性,初始值为normal;
     - text-transform(处理文本的大小写): 值有uppercase,lowercase,capitalize(只对首字母大写),none,inherit,应用于所有元素,有继承性,初始值为none;
     - text-decoration: 值有none,underline,overline,line-through,inherit,blink,应用于所有元素,无继承性,初始值为none;
     - text-shadow(文本阴影): 值有none,<color>|<length><length><length>(颜色和长度位置可交换),应用于所有元素,无继承性,初始值为none,例如,定义一个向右偏移5像素向下偏移0.5em像素绿色阴影,而且不模糊:text-shadow: green 5px 0.5em 0(前两个向右和向下的偏移,最后一个定义阴影的半径);
     - white-space(处理空白符,换行,tab字符): 应用所有元素,无继承性,初始值为normal,值有如下表

       | 值 | 空白符 | 换行符 | 自动换行 |
       | -----|:----:| ----:| ----:|
       | pre-line | 合并 | 保留 | 允许 |
       | normal | 合并 | 忽略 | 允许 |
       | nowrap | 合并 | 忽略 | 不允许 |
       |pre| 保留 | 保留 | 不允许 |
       |pre-wrap| 保留 | 保留 | 不允许 |
     - direction属性影响块级元素中文本的书写方向,表中列布局的方向,内容水平填充其元素框的方向,以及两端对其元素中的最后一行位置.对于行内元素,只有当unicode-bidi属性设置为emed或bidi-override时才会应用direction属性;

### (五) 基本视觉格式化
  1. 基本框
     - 内边距不能是负值,但是外边距可以为负值;
     - 边框的颜色跟字体的颜色一致;
  2. 水平属性
     - 水平格式化有"7大属性":yangshi margin-left,border-left,padding-left,width,padding-right,border-right,margin-right;
     - "7大属性"中只有两个属性可以设置为auto,分别是元素内容的width,以及左右边距
     - 使用width,margin-left,margin-right: ①如果左右边距都设置为auto,就会把元素居中显示,但这方法不同于text-align,text-align只用于块级元素的內联内容;②width和任意一个左右边距都设置为auto时,另一左右边距设置特定的值,则设置为auto的外边距将减为0;③当三个都设置为auto的时候,则左右边距将为0;
     - 7个水平属性的总和要等于父元素的width;
     - 边框的宽度不能师百分数,而只能是长度;
  3. 垂直属性
     - 垂直格式化中也有跟水平格式化类似的"7大属性";
     - 使用height,margin-top,margin-bottom: 当两个上下边距都设置为auto时,则不会跟水平格式化那样居中元素,相反则会自动把上下边距都变为0;
     - 垂直外边距可以进行合并,两个外边距中较小的一个会被较大的一个合并;
     - 在垂直外边距进行合并的时候,如果两个外边距都设置为负值,则浏览器会取两个外边距绝对值的最大值;

   
    

