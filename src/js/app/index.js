
require('less/index.less');

var NoteManager = require('mod/note-manager.js');
var Event = require('mod/event.js');
var WaterFall = require('mod/waterfall.js');
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