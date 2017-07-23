
require('less/index.less');

var NoteManager = require('mod/note-manager.js');
var Event = require('mod/event.js');
var WaterFall = require('mod/waterfall.js');
var GoTop = require("mod/slowtop.js");
var HideNav = require('mod/hideNav.js');

NoteManager.load();

$('.add-note').on('click', function() {
    NoteManager.add();
});

Event.on('waterfall', function(){
    WaterFall.init($('#content'));
});

new GoTop();

new HideNav($('#header'));