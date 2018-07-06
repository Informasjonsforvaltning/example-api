const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

var Lynx = require('lynx');
var metrics = new Lynx('telegraf', 8125);
metrics.increment('service.job_done');
metrics.gauge('service.queue_size', 100);
metrics.set('service.request_id', 10);
metrics.timing('service.job_task', 500); // time in ms

app.use(logger());
app.use(bodyParser());

const db = [
  {id: 2, name: 'tobi', species: 'ferret'},
  {id: 3, name: 'loki', species: 'ferret'},
  {id: 1, name: 'jane', species: 'ferret'}
];

const pets = {
  list: (ctx) => {
    ctx.body = db;
    metrics.timing('service.job_task', 500); // time in ms
  },

  create: (ctx) => {
    console.log('Creating: ', ctx.request.body);
    db.push(ctx.request.body);
    ctx.set('Location', 'http://localhost:8080/pets/' + ctx.request.body.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    ctx.body = pet;
  },

  update: (ctx, id) => {
    console.log('Updating: ', ctx.request.body);
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db[index] = ctx.request.body;
      db[index].id = pet.id;
    }
    ctx.status = 204;
  },

  delete: (ctx, id) => {
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db.splice(index, 1);
    }
    ctx.status = 204;
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
