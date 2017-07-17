
var WaterFall = (function(){        //瀑布
  var $ct;                          //容器
  var $items;                       //列表

  function render($c){              //渲染
    $ct = $c;                       //保存参数
    $items = $ct.children();        //保存儿子

    var nodeWidth = $items.outerWidth(true),          //元素的整体宽
      colNum = parseInt($(window).width()/nodeWidth), //窗口宽度 / 元素宽 = 该行元素的个数～
      colSumHeight = [];                              //来个空数组
    
    for(var i = 0; i<colNum;i++){                     //循环每个元素设置值为0
      colSumHeight.push(0);
    }

    $items.each(function(){                           //遍历
      var $cur = $(this);                             //保存this

      //colSumHeight = [100, 250, 80, 200]

      var idx = 0,                                    //基点
        minSumHeight = colSumHeight[0];               //最小的？ = 数组第一个元素

      for(var i=0;i<colSumHeight.length; i++){        //信用不够严数组
        if(colSumHeight[i] < minSumHeight){           //当循环到数组某个元素比 最小的？小
          idx = i;                                    //下标取代i
          minSumHeight = colSumHeight[i];             //最小的？ 等于这个值
        }
      }

      $cur.css({                                      //这个元素样式
        left: nodeWidth*idx,                          //离左距离 为 几个元素的宽
        top: minSumHeight                             //高距离为最小的？
      });
      colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];   //数组【最小的？】 =  这个元素整体高度 += 原本高度
    });
  }


  $(window).on('resize', function(){                  //当窗口调整，触发render渲染
    render($ct);
  })


  return {                                            //返回init
    init: render
  }
})();

module.exports = WaterFall
