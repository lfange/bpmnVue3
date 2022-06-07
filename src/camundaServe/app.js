const Koa = require('koa')
var Router = require('koa-router')
const app = new Koa()
var router = new Router()

const {
  Client,
  logger
} = require('camunda-external-task-client-js');

const result = {
  result: 'result'
}

// 外部任务客户端的配置:
//  - 'baseUrl': 流程引擎的url
//  - 'logger': 自动记录的日志等级
//  - 'asyncResponseTimeout': 长轮询的超时时间
const config = {
  baseUrl: 'http://localhost:8080/engine-rest',
  use: logger,
  asyncResponseTimeout: 10000
};

// 根据配置创建一个新的外部任务客户端
const client = new Client(config);

// 订阅charge-card
client.subscribe('charge-card', async function ({
  task,
  taskService
}) {
  // 将您的业务逻辑写在这

  // 获取流程变量
  const amount = task.variables.get('amount');
  const item = task.variables.get('item');

  console.log(`Charging credit card with an amount of ${amount}€ for the item '${item}'...`);

  result = {
    task,
    taskService,
    amount,
    item
  }

  console.log('application/json', result)
  // 完成任务
  await taskService.complete(task);
});



router.get('/getsult', (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  // ctx.router available
  ctx.body = JSON.stringify(result)
})


console.log('this', result)

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(5858)
console.log('[camundaServe] start-quick is starting at port 5858')