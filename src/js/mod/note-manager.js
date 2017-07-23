var Toast = require('./toast.js');      //请求提示
var Note = require('./note.js');         //请求memo
var Event = require('mod/event.js');          //请求事件

var NoteManager = (function(){

    function load() {                           //生成
        $.get('/api/notes')                       //请求
            .done(function(ret){                    //获取数据
                if(ret.status === 0){                 //成功
                    if (ret.data) {
                        $.each(ret.data, function (idx, article) {   //遍历数据，index|article
                            new Note({                      //new|实例化 memo
                                id: article.id,
                                context: article.text,
                                update: new Date(parseInt(article.updatedAt)).toLocaleString('chinese', {hour12: false}),
                                username: article.username
                            });
                        });
                        Event.fire('waterfall');            //触发瀑布
                    }
                }else{
                    Toast(ret.errorMsg);                //提示
                }
            }).fail(function(){
            Toast('网络出现异常');                     //提示
        });


    }

    function add(){                             //添加——实例note
        new Note();
    }

    return {
        load: load,                               //返回 load
        add: add                                  //返回 添加
    }

})();

module.exports = NoteManager;