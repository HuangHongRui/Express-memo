/**
 * Created by huanghongrui on 17-7-21.
 */


function GoTop() {              //置顶
    this.createNode();
    this.bindEvent();
}
GoTop.prototype = {
    createNode : function() {
        this.target = $('<div class="goTop">T\nO\nP</div>');
        this.target.css({
            position: 'fixed',
            top: '50%' ,
            right: 0,
            transform:'translateY(-50%)',
            cursor: 'pointer',
            height:'100px',
            width: '5px',
            'line-height': '33px',
            padding: '10px',
            'border-radius': '5px',
            opacity: 0.5,
            'background-color': 'rgba(255,255,0,0.6)',
            'font-weight': 800,
            // 'display': 'none'
    });
        $('body').append(this.target)
    },
    bindEvent : function() {
        var _this = this;
        $(window).on('scroll',function() {
            var scrollTop = $(window).scrollTop();
            if(scrollTop > 300){
                _this.target.fadeIn(1000)
            } else {
                _this.target.fadeOut(500)
            }
        });
        _this.target.click(function() {

            $('html, body').animate({
                scrollTop:0
            }, 'slow')
        })
    }
};
module.exports = GoTop;