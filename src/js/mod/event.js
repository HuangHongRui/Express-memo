
  var EventCenter = (function(){        //立即执行

    var events = {};                    //空对象

    function on(evt, handler){          
      events[evt] = events[evt] || [];  //保存

      events[evt].push({
        handler: handler
      });
    }

    function fire(evt, args){           //开火-。-执行
      if(!events[evt]){                 
        return;
      }
      for(var i=0; i<events[evt].length; i++){
        events[evt][i].handler(args);
      }
      
    }

    return {
      on: on,
      fire: fire
    }
  })();

  module.exports = EventCenter;





  // EventCenter.on('text-change', function(data){
  //  console.log(data);
  // });
  
  // EventCenter.on('text-change', function(data){
  //  alert(1);
  // });
  

  // EventCenter.fire('text-change', 100);
   