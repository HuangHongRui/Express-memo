require('less/toast.less');               //渲染css
  
function toast(msg, time){                //提示
  this.msg = msg;                         //保留内容
  this.dismissTime = time||1000;          //保存时间 ms
  this.createToast();                     //执行创建元素
  this.showToast();                       //执行显示
}
toast.prototype = {                       //原型
  createToast: function(){                //创建
    var tpl = '<div class="toast">'+this.msg+'</div>';    //创建元素
    this.$toast = $(tpl);                 //保存于$toast
    $('body').append(this.$toast);        //插入该元素
  },
  showToast: function(){                  //显示
    var self = this;                      
    this.$toast.fadeIn(300, function(){   //渐现
      setTimeout(function(){              //设置定时
         self.$toast.fadeOut(300,function(){    //渐隐
           self.$toast.remove();          //删除
         });
      }, self.dismissTime);               //触发倒数时间
    });

  }
};

function Toast(msg,time){                 //开关
  return new toast(msg, time);            //返回实例
}

window.Toast = Toast

module.exports.Toast = Toast;