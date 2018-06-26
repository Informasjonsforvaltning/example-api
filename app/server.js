const logger = require('koa-logger');
const _ = require ('koa-route');
const Koa = require('koa');
const app = new Koa();

// Metrics via statsd
var StatsD = require('node-statsd');
var metrics = new StatsD();
metrics.increment('service.job_done');
metrics.gauge('service.queue_size', 100);
metrics.set('service.request_id', 10);
metrics.timing('service.job_task', 500); // time in ms

app.use(logger());

const db = {
  1: { name: 'tobi', species: 'ferret'},
  2: { name: 'loki', species: 'ferret'},
  3: { name: 'jane', species: 'ferret'}
};

const pets = {
  list: (ctx) => {
    ctx.body = db;
  },

  show: (ctx, name) => {
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet;
  }
};

app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:name', pets.show))

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
