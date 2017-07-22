require('less/note.less');                //请求渲染

var Toast = require('./toast.js').Toast;  //请求提示
var Event = require('mod/event.js');      //请求事件

function Note(opts){
  this.initOpts(opts);                    //调用函数方法
  this.createNote();                      //调用创建
  this.setStyle();                        //调用样式
  this.bindEvent();                       //调用绑定事件
}

Note.prototype = {                        //原型添加方法
  colors: [                               //颜色
    ['#ea9b35','#efb04e'], // headColor, containerColor
    ['#dd598b','#e672a2'],
    ['#eee34b','#f2eb67'],
    ['#c24226','#d15a39'],
    ['#c1c341','#d0d25c'],
    ['#3f78c3','#5591d2']
  ],

  defaultOpts: {                          //默认啥——
    id: '',                               //Note的 id
    $ct: $('#content').length>0?$('#content'):$('body'),    //默认存放 Note 的容器
    context: '输入内容'                 //Note 的内容
  },

  initOpts: function (opts) {             //
    this.opts = $.extend({}, this.defaultOpts, opts||{});   //extend描述: 将两个或更多对象的内容合并到第一个对象。
    if(this.opts.id){                     //opts 的 id 获取
       this.id = this.opts.id;
    }
  },

  createNote: function () {               //创建元素
    var tpl =  '<div class="note">'
              + '<div class="note-head"><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              +'</div>';
    this.$note = $(tpl);                  //元素
    this.$note.find('.note-ct').html(this.opts.context);    //找到并插入内容
    this.opts.$ct.append(this.$note);                       //容器
    if(!this.id) {
      this.$note.attr('id','atarget');
      Event.fire('waterfall');
      $("html,body").animate({scrollTop: $("#atarget").offset().top}, 1000);
      this.$note.removeAttr('id','atarget');
    }
  },

  setStyle: function () {                                                 //样式
    var color = this.colors[Math.floor(Math.random()*6)];                 //颜色随机于color
    this.$note.find('.note-head').css('background-color', color[0]);      //标题的背景色
    this.$note.find('.note-ct').css('background-color', color[1]);        //内容的背景色
  },

  setLayout: function(){                      //设置布局
    var self = this;                      
    if(self.clk){                             //有的话结束定时器
      clearTimeout(self.clk);
    }
    self.clk = setTimeout(function(){         //设置定时器
      Event.fire('waterfall');                //事件 瀑布流 执行
    },100);
  },

  bindEvent: function () {                    //绑定
    var self = this,      
        $note = this.$note, 
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');

    $delete.on('click', function(){            //点击触发——删除
      self.delete();
    })

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {                          //焦点于内容
      if($noteCt.html()=='输入内容') $noteCt.html('');      //如果内容是...那么清空
      $noteCt.data('before', $noteCt.html());                 //描述: 在匹配元素上存储任意相关数据.
    }).on('blur paste', function(e) {                          //paste向一个选中区域粘贴剪切板内容的时候，会触发粘贴事件
      if( $noteCt.data('before') != $noteCt.html() ) {        //如果元素内容 ！= X
        $noteCt.data('before',$noteCt.html());                //内容合并 X
        $(e.target).parent().removeAttr('id','latecss')
        self.setLayout();                                     //调用函数————setLayout（）
        if(self.id){                                          //有id吗0,0？
          self.edit($noteCt.html())                           //有即编辑内容
        }else{
          self.add($noteCt.html())                            //无即添加
        }
      }
    });

    //设置笔记的移动
    $noteHead.on('mousedown', function(e){                          //鼠标按下触发
      var evtX = e.pageX - $note.offset().left,                     //evtX 计算事件的触发点在dialog
          evtY = e.pageY - $note.offset().top;                      //内部到 dialog 的左边缘的距离
      $note.addClass('draggable').data('evtPos', {x:evtX, y:evtY}); //把事件到 dialog 边缘的距离保存下来
    }).on('mouseup', function(){                                    //鼠标松开出发
       $note.removeClass('draggable').removeData('pos');            //元素删除clss&Data
    });

    $('body').on('mousemove', function(e){                //鼠标移动
      $('.draggable').length && $('.draggable').offset({  //
        top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX-$('.draggable').data('evtPos').x
      });
    });
  },

  edit: function (msg) {              //编辑内容
    var self = this;
    $.post('/api/notes/edit',{        //使用一个HTTP POST 请求从服务器加载数据。
        id: this.id,    
        note: msg
      }).done(function(ret){          //请求完成数据到来
      if(ret.status === 0){           //状态成功
        Toast('更新成功 | UPDATE SUCCESS');      //提示
      }else{
        Toast(ret.errorMsg);          //提示失败
      }
    })
  },

    add: function (msg){                  //添加
    var self = this;
    $.post('/api/notes/add', {note: msg}) //请求，数据内容为msg
      .done(function(ret){                //数据到来
        if(ret.status === 0){
          Toast('新增成功 | ADD SUCCESS');           //成功
        }else{
          self.$note.remove();            //移除元素
          Event.fire('waterfall');         //触发瀑布流事件
          Toast(ret.errorMsg);            //提示
        }
      });
  },

  delete: function(){                           //Dle
    var self = this;
    $.post('/api/notes/delete', {id: this.id})  //请求数据，内容Id
      .done(function(ret){                      //数据
        if(ret.status === 0){                   //成功
          Toast('删除成功 | DELETE SUCCESS');    //提示
          self.$note.remove();                  //删除
          Event.fire('waterfall')               //事件瀑布流
        }else{  
          Toast(ret.errorMsg);                  //提示
        }
    });

  }

};

module.exports.Note = Note;                     //模块入口