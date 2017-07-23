require('less/note.less');
var Toast = require('./toast.js');
var Event = require('./event.js');


function Note(opts){
  this.initOpts(opts);                    //调用函数方法
  // this.createNote();                      //调用创建
  this.setStyle();                        //调用样式
  this.bindEvent();                       //调用绑定事件
}

Note.prototype = {

    initOpts: function (opts) {
      var self = this;
      this.defaultOpts = {                          //默认啥——
        id: '',                               //Note的 id
        time: new Date().toLocaleString('chinese', { hour12: false }),
        $ct: $('#content').length > 0 ? $('#content') : $('body'),    //默认存放 Note 的容器
        context: '请输入内容...'                 //Note 的内容
      };

      this.opts = $.extend({}, this.defaultOpts, opts || {});   //extend描述: 将两个或更多对象的内容合并到第一个对象。
      if(this.opts.id){                     //opts 的 id 获取
         this.id = this.opts.id;
      }

      var tpl = '<div class="note">'
              + '<div class="note-head"><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              + '<div class="note-foot"><span class="username"></span><span class="time">'
              + new Date().toLocaleString('chinese', { hour12: false }) + '</span></div>'
              +'</div>';
      this.$note = $(tpl);                                    //元素
      this.$note.find('.time').html(this.opts.update);
      this.$note.find('.username').html(this.opts.username);
      this.$note.find('.note-ct').html(this.opts.context);
      this.opts.$ct.append(this.$note);                       //容器
      if(!this.id) {
        this.$note.attr('id','atarget').css({ top: '-30px' });
        // Event.fire('waterfall');


      }
        this.setStyle();
        Event.fire('waterfall');
        if ($(window).scrollTop() > 50) {
            $("html,body").animate({scrollTop: $("#atarget").offset().top}, 1000);
        } else {
            this.$note.removeAttr('id','atarget');
        }

    },

  setStyle: function () {
    var headcolors = ['#ea9b35', '#dd598b', '#eee34b', '#c24226', '#c1c341', '#3f78c3'];
    var ctcolors = ['#efb04e', '#e672a2', '#f2eb67', '#d15a39', '#d0d25c', '#5591d2'];
    var headcolor = headcolors[Math.floor(Math.random() * 6)];
    var ctcolor = ctcolors[Math.floor(Math.random() * 6)];              //颜色随机于color
    this.$note.find('.note-head').css('background-color', headcolor);      //标题的背景色
    this.$note.find('.note-ct').css('background-color', ctcolor);        //内容的背景色
    this.bindEvent()
  },

  setLayout: function(){                      //设置布局
    var self = this;                      
    if( self.clk ){                             //有的话结束定时器
      clearTimeout( self.clk );
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
        $delete = $note.find('.delete'),
        $noteTime = $note.find('.time'),
        beforCt = $noteCt.html();

    $delete.on('click', function(){            //点击触发——删除
      self.delete();
    });

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {                          //焦点于内容
      if($noteCt.html() === '请输入内容...') $noteCt.html('');      //如果内容是...那么清空
      $noteCt.data('before', beforCt);                 //描述: 在匹配元素上存储任意相关数据.
    }).on('blur paste', function() {                          //paste向一个选中区域粘贴剪切板内容的时候，会触发粘贴事件
      if( $noteCt.data('before') != $noteCt.html() ) {
        if( $noteCt.html() === '' || $noteCt.html() == '<br>'){
          $noteCt.html(beforCt);
          Toast('内容不能为空..');
          return
        }
        // $noteCt.data('before',$noteCt.html());                //内容合并 X
        // self.setLayout();                                     //调用函数————setLayout（）
        if(self.id){                                          //有id吗0,0？
          self.edit($noteCt, $noteTime)                           //有即编辑内容
        }else{
          self.add($noteCt.html())                            //无即添加
        }
          self.setLayout();
      }
    });

    //点击头部拖动
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

  edit: function ($noteCt, $noteTime) {              //编辑内容
    var beforeCt = $noteCt.data('before');
    var msg = $noteCt.html();
    $.post('/api/notes/edit',{        //使用一个HTTP POST 请求从服务器加载数据。
        id: this.id,    
        note: msg
      }).done(function(ret){          //请求完成数据到来
      if(ret.status === 0){           //状态成功
        Toast('更新成功 | UPDATE SUCCESS');
        $noteTime.html( new Date().toLocaleString('chinese', { hour12: false }) );
      }else{
        $noteCt.html( beforeCt );
        Toast(ret.errorMsg);          //提示失败
      }
    })
  },

    add: function (msg){                  //添加
    var self = this;
    $.post('/api/notes/add', {
      note: msg
    }).done(function(ret){                //数据到来
        if(ret.status === 0){
            self.$note.remove();
            new Note({
                id: ret.result.id,
                context: ret.result.text,
                update: new Date(parseInt(ret.result.updatedAt)).toLocaleString('chinese', { hour12: false }),
                username: ret.result.username
            });
          Toast('新增成功 | ADD SUCCESS');           //成功
        }else{
          self.$note.remove();            //移除元素
          Toast(ret.errorMsg);            //提示
        }
      });
  },

  delete: function(){                           //Dle
    var self = this;
    $.post('/api/notes/delete', { id: this.id })  //请求数据，内容Id
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

module.exports = Note;                     //模块入口