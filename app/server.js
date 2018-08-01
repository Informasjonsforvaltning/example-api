const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const responseTime = require('response-time');

var StatsD = require('hot-shots');
const options = {
  "host": "localhost",
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
    var starttimer = Date.now();
    ctx.body = db;
    metrics.timing('pets.timer_list', Date.now() - starttimer);
    metrics.increment('pets.counter_list');
  },

  create: (ctx) => {
    var starttimer = Date.now();
    console.log('Creating: ', ctx.request.body);
    var index = db.push(ctx.request.body);
    db[index-1].id = ++maxId;
    ctx.set('Location', 'http://localhost:8080/pets/' + ctx.request.body.id);
    ctx.status = 201;
    metrics.timing('pets.timer_list', Date.now() - starttimer);
    metrics.increment('pets.counter_create');
  },

  show: (ctx, id) => {
    var starttimer = Date.now();
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    ctx.body = pet;
    metrics.timing('pets.timer_show', Date.now() - starttimer);
    metrics.increment('pets.counter_show');
  },

  update: (ctx, id) => {
    var starttimer = Date.now();
    var pet = db.find( o => o.id === parseInt(id));
    console.log('Updating: ', id, ' ', ctx.request.body);
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db[index] = ctx.request.body;
      db[index].id = pet.id;
    }
    ctx.status = 204;
    metrics.timing('pets.timer_update', Date.now() - starttimer);
    metrics.increment('pets.counter_update');
},

  delete: (ctx, id) => {
    var starttimer = Date.now();
    console.log('Deleting: ', id);
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    var index = db.indexOf(pet);
    if (index > -1) {
      db.splice(index, 1);
    }
    ctx.status = 204;
    metrics.timing('pets.timer_delete', Date.now() - starttimer);
    metrics.increment('pets.counter_delete');
  }
};

app.use(_.get('/pets', pets.list));
app.use(_.post('/pets', pets.create));
app.use(_.get('/pets/:id', pets.show));
app.use(_.put('/pets/:id', pets.update));
app.use(_.delete('/pets/:id', pets.delete));

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
