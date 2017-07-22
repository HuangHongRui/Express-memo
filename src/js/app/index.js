require('less/index.less');       // 请求渲染css

var NoteManager = require('mod/note-manager.js').NoteManager; //请求NoteManager | memo处理
var Event = require('mod/event.js');          //请求事件
var WaterFall = require('mod/waterfall.js');  //请求瀑布
var GoTop = require("mod/slowtop.js");
var HideNav = require('mod/hideNav.js');

NoteManager.load();                           //memo处理

$('.add-note').on('click', function() {       //点击按钮触发添加～
  NoteManager.add();
});

Event.on('waterfall', function(){             //事件监控——  waterfall 触发
  WaterFall.init($('#content'));              //初始化
});

new GoTop();

new HideNav($('#header'));