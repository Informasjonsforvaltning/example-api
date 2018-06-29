const logger = require('koa-logger');
const _ = require ('koa-route');
const Koa = require('koa');
const app = new Koa();

var Lynx = require('lynx');
var metrics = new Lynx('telegraf', 8125);
metrics.increment('service.job_done');
metrics.gauge('service.queue_size', 100);
metrics.set('service.request_id', 10);
metrics.timing('service.job_task', 500); // time in ms

app.use(logger());

const db = [
  {id: 1, name: 'tobi', species: 'ferret'},
  {id: 2, name: 'loki', species: 'ferret'},
  {id: 3, name: 'jane', species: 'ferret'}
];

const pets = {
  list: (ctx) => {
    ctx.body = db;
    metrics.timing('service.job_task', 500); // time in ms
  },

  show: (ctx, id) => {
    const pet = db[id];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet;
  },

  delete: (ctx, id) => {
    var pet = db[id];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    delete db[id];
    ctx.status = 204;
    ctx.body = pet;
  }
};

app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:id', pets.show))
app.use(_.delete('/pets/:id', pets.delete))

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
