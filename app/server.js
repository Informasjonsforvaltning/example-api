const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

var StatsD = require('hot-shots');
const options = {
  "host": "telegraf",
  "port": "8125"
}
var metrics = new StatsD(options);
// Catch socket errors so they don't go unhandled, as explained
// in the Errors section below
metrics.socket.on('error', function(error) {
  console.error("Error in socket: ", error);
});


app.use(logger());
app.use(bodyParser());

const db = [
  {id: 1, name: 'tobi', species: 'ferret'},
  {id: 2, name: 'loki', species: 'ferret'},
  {id: 3, name: 'jane', species: 'ferret'}
];
var maxId = 3;

const pets = {
  list: (ctx) => {
    ctx.body = db;
    metrics.increment('service.list_counter');
  },

  create: (ctx) => {
    console.log('Creating: ', ctx.request.body);
    var index = db.push(ctx.request.body);
    db[index-1].id = ++maxId;
    ctx.set('Location', 'http://localhost:8080/pets/' + ctx.request.body.id);
    ctx.status = 201;
    metrics.increment('service.create_counter');
  },

  show: (ctx, id) => {
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    ctx.body = pet;
    metrics.increment('service.show_counter');
  },

  update: (ctx, id) => {
    console.log('Updating: ', id, ' ', ctx.request.body);
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db[index] = ctx.request.body;
      db[index].id = pet.id;
    }
    ctx.status = 204;
    metrics.increment('service.update_counter');
},

  delete: (ctx, id) => {
    console.log('Deleting: ', id);
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db.splice(index, 1);
    }
    ctx.status = 204;
    metrics.increment('service.delete_counter');
  }
};

app.use(_.get('/pets', pets.list));
app.use(_.post('/pets', pets.create));
app.use(_.get('/pets/:id', pets.show))
app.use(_.put('/pets/:id', pets.update))
app.use(_.delete('/pets/:id', pets.delete))

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
