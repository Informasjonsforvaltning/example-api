const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const responseTime = require('response-time');

// only set up statsd if in production:
if(process.env.NODE_ENV === 'production') {
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
}

// Metric middleware, cf https://github.com/koajs/koa/blob/master/docs/middleware.gif
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // In production we send metrics to statsd, otherwise to console
  if(process.env.NODE_ENV === 'production') {
    metrics.timing(`pets.timer_${ctx.method}_${ctx.url}`, ms);
    metrics.increment(`pets.counter_${ctx.method}_${ctx.url}`);
  } else {
    console.log(`pets.timer_${ctx.method}_${ctx.url} - ${ms}`);
  }
});

app.use(logger());
app.use(bodyParser());

const db = [
  {id: 1, name: 'tobi', species: 'ferret'},
  {id: 2, name: 'loki', species: 'ferret'},
  {id: 3, name: 'jane', species: 'ferret'}
];
var maxId = 3;

// Content negotiation middleware.
// For now we only return application/json
app.use(async (ctx, next) => {
  await next();
  // no body? nothing to format, early return
  if (!ctx.body) return;
  // Check which type is best match by giving
  // a list of acceptable types to `req.accepts()`.
  const type = ctx.accepts('json');
  // accepts json, koa handles this for us,
  // so just return
  if (type === 'json') return;
  // not acceptable
  if (type === false) ctx.throw(406);
});

const pets = {
  list: (ctx) => {
    ctx.body = db;
  },

  create: (ctx) => {
    console.log('Creating: ', ctx.request.body);
    var index = db.push(ctx.request.body);
    db[index-1].id = ++maxId;
    ctx.set('Location', 'http://localhost:8080/pets/' + ctx.request.body.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var pet = db.find( o => o.id === parseInt(id));
    if (!pet) return ctx.throw(404, 'cannot find that pet');
    ctx.body = pet;
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
