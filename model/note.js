var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined, undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/database.sqlite')
});

// id 字段 UID createTime updateTime
var Note = sequelize.define('note', {
  //内容
  text: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING
  }
});

module.exports.Note = Note;

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