require('less/note.less');
var Toast = require('./toast.js');
var Event = require('./event.js');


function Note(opts){
  this.initOpts(opts);
}

Note.prototype = {

    initOpts: function (opts) {
      var self = this;
        this.defaultOpts = {
        id: '',
        time: new Date().toLocaleString('chinese', { hour12: false }),
        $ct: $('#content').length > 0 ? $('#content') : $('body'),
        context: '请输入内容...'
      };

      this.opts = $.extend({}, this.defaultOpts, opts || {});   // 将两个或更多对象的内容合并到第一个对象。
      if(this.opts.id){
         this.id = this.opts.id;
      }

      var tpl = '<div class="note">'
              + '<div class="note-head"><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              + '<div class="note-foot"><span class="username"></span><br/><span class="time">'
              + new Date().toLocaleString('chinese', { hour12: false }) + '</span></div>'
              +'</div>';
      this.$note = $(tpl);
      this.$note.find('.time').html(this.opts.update);
      this.$note.find('.username').html(this.opts.username);
      this.$note.find('.note-ct').html(this.opts.context);
      this.opts.$ct.append(this.$note);
      if(!this.id) {
        this.$note.siblings().removeAttr('id','atarget');
        this.$note.attr('id','atarget').css({ top: '-30px' });

        findTarget();
      }
        Event.fire('waterfall');
        this.setStyle();
        function findTarget() {
          var targetTop,
              windowTop = ($(window).scrollTop()) + $(window).height();
            setTimeout(()=>{
              targetTop = $('#atarget').offset().top;
              console.log(targetTop + '|' + windowTop);
              if (windowTop < targetTop){
                $("html,body").animate({scrollTop: targetTop}, 1000);
              }
            },500);
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

  setLayout: function(){
    var self = this;                      
    if( self.clk ){
      clearTimeout( self.clk );
    }
    self.clk = setTimeout(function(){
      Event.fire('waterfall');
    },100);
  },

  bindEvent: function () {
    var self = this,      
        $note = this.$note, 
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete'),
        $noteTime = $note.find('.time'),
        beforCt = $noteCt.html();

    $delete.on('click', function(){
      self.delete();
    });

    //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
    $noteCt.on('focus', function() {
      if($noteCt.html() === '请输入内容...') $noteCt.html('');
      $noteCt.data('before', beforCt);
    }).on('blur paste', function() {
      if( $noteCt.data('before') != $noteCt.html() ) {
        if( $noteCt.html() === '' || $noteCt.html() == '<br>'){
          $noteCt.html(beforCt);
          Toast('内容不能为空..');
          return
        }
        // $noteCt.data('before',$noteCt.html());
        // self.setLayout();
        if(self.id){
          self.edit($noteCt, $noteTime)
        }else{
          self.add($noteCt.html())
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

    $('body').on('mousemove', function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX-$('.draggable').data('evtPos').x
      });
    });
  },

  edit: function ($noteCt, $noteTime) {
    var beforeCt = $noteCt.data('before');
    var msg = $noteCt.html();
    $.post('/api/notes/edit',{
        id: this.id,    
        note: msg
      }).done(function(ret){
      if(ret.status === 0){
        Toast('更新成功 | UPDATE SUCCESS');
        $noteTime.html( new Date().toLocaleString('chinese', { hour12: false }) );
      }else{
        $noteCt.html( beforeCt );
        Toast(ret.errorMsg);
      }
    })
  },

    add: function (msg){
    var self = this;
    $.post('/api/notes/add', {
      note: msg
    }).done(function(ret){
        if(ret.status === 0){
            self.$note.remove();
            new Note({
                id: ret.result.id,
                context: ret.result.text,
                update: new Date(parseInt(ret.result.updatedAt)).toLocaleString('chinese', { hour12: false }),
                username: ret.result.username
            });
          Toast('新增成功 | ADD SUCCESS');
        }else{
          self.$note.remove();
          Toast(ret.errorMsg);
        }
      });
  },

  delete: function(){
    var self = this;
    $.post('/api/notes/delete', { id: this.id })
      .done(function(ret){
        if(ret.status === 0){
          Toast('删除成功 | DELETE SUCCESS');
          self.$note.remove();
          Event.fire('waterfall')
        }else{  
          Toast(ret.errorMsg);
        }
    });
  }
};

module.exports = Note;