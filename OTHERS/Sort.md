---
layout: post
category: Andraw-lin
title: Sort
summary: Sort
---

## **排序总结**

### (一) 冒泡排序

 - 核心思想: 依次比较相邻的两个数, 将小数 ( 或者大数 ) 放在前面, 大数 ( 或者小数 ) 放在后面 ;
 - 平均时间复杂度: **O(n^2)** ;
 - 最好时间复杂度: **O(n)** ;
 - 最坏时间复杂度: **O(n^2)** ; 
 - 稳定性: 稳定 ;
 - 栗子: 
 
   ```javascript
        var arr = [-5, -9, 10, 2, 7, 15, 0];
        for(var i = 0; i < arr.length; i++){
          for(var j = i + 1; j < arr.length; j++){
            if(arr[i] > arr[j]){
              var temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
            }
          }
        }
        console.log(arr);           // 输出为: [-9, -5, 0, 2, 7, 10, 15]
   ```
   
### (二) 选择排序
 - 核心思想: 从数组里面先找到最小的元素, 然后把它放到第一位, 然后再在剩下元素里找到最小的, 把它放到第二位, 以此类推 ; 
 - 平均时间复杂度: **O(n^2)** ;
 - 最好时间复杂度: **O(n^2)** ;
 - 最坏时间复杂度: **O(n^2)** ;
 - 稳定性: 不稳定 ; 
 - 栗子: 
   
   ```javascript
        var arr = [-5, -9, 10, 2, 7, 15, 0];
        for(var i = 0; i < arr.length; i++){
          var min = arr[i];
          var index = i;
          for(var j = i + 1; j < arr.length ; j++){
            if(arr[j] < min){
              min = arr[j];
              index = j;
            }
          }
          arr[index] = arr[i];
          arr[i] = min;
        }
        console.log(arr);           // 输出结果为: [-9, -5, 0, 2, 7, 10, 15]
   ```
   
   
### (三) 插入排序
 - 核心思想: 每一步都将一个待排序数据按其大小插入到已经排序的数据中的适当位置, 直到全部插入完毕 ; 
 - 平均时间复杂度: **O(n^2)** ;
 - 最好时间复杂度: **O(n)** ;
 - 最坏时间复杂度: **O(n^2)** ;
 - 栗子: 

   ```javascript
        var arr = [-5, -9, 10, 2, 7, 15, 0];
        for(var i = 1; i < arr.length; i++){
          var insertNote = arr[i];
          var j = i - 1;
          while(j >= 0 && arr[j] > insertNote){
            arr[j+1] = arr[j];
            j--;
          }
          arr[j+1] = insertNote;
        }
        console.log(arr);           // 输出结果为: [-9, -5, 0, 2, 7, 10, 15]
   ```
   
### (四) 快速排序

 - 核心思想: 
   + 先从数列中取出一个数作为基准数 ;
   + 分区过程, 将比基准数大的数全放到它的右边, 小于或等于它的数全放到它的左边 ; 
   + 再对分好的左右区重复第二步, 直到各区间只有一个数 ; 
 - 平均时间复杂度: **O(nlog2n)** ;
 - 最好时间复杂度: **O(nlog2n)** ;
 - 最坏时间复杂度: **O(n^2)** ;
 - 栗子: 

   ```javascript
        var arr = [-5, -9, 10, 2, 7, 15, 0];

        quick(arr, 0, arr.length-1);
        
        console.log(arr);           // 输出结果为: [-9, -5, 0, 2, 7, 10, 15]
        
        // 快速排序的主函数
        function quick(arr, left, right){
          if(left < right){
            var middle = getMid(arr, left, right);
            
            // 递归调用本函数
            quick(arr, left, middle--);
            quick(arr, middle++, right);
          }
        }
        
        // 获取中间项
        function getMid(arr, left, right){
          var temp = arr[left];
          while(left < right){
            while(left < right && arr[right] >= temp){
              right--;
            }
            if(left < right){
              arr[left++] = arr[right];
            }
            while(left < right && arr[left] < temp){
              left++;
            }
            if(left < right){
              arr[right--] = arr[left];
            }
          }
          arr[low] = temp;
          return low;
        }
   ```