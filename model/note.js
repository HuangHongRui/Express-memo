var Sequelize = require('sequelize');    //请求数据库
var path = require('path');

//建立连接
var sequelize = new Sequelize(undefined, undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',                     //采用sqlite数据库
  storage: path.join(__dirname, '../database/database.sqlite')
});                                      //数据库路径

//模型
var Note = sequelize.define('note', {

  text: {
    type: Sequelize.STRING               //内容？
  },
  uid: {
    type: Sequelize.STRING               //每个登录用户uid
  }
});

Note.sync();                             //同步模型到数据库

module.exports.Note = Note;              //出口

// Note.sync(true)
// Note.sync({force: true}) //重置

/*
Note.findAll({raw: true, where: {id: 2}}).then(notes => {
     console.log(notes)
})


Note.sync().then(() => {
    Note.create({text: 'Huang'})
}).then(() => {
    Note.findAll({raw: true}).then(notes => {
        console.log(notes)
    })
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/