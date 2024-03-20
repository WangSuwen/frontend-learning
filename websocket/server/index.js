const express = require('express')
const {Server} = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express()
app.use(cors());
const port = 3000
const corsOptions = {
	origin: '*',
	// methods: ['OPTION', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    methods: '*',
	credentials: true
};
app.set('views', path.join(__dirname, '../client'))

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html')

// 基于Express 的 HTTP对象 创建 socket服务
const httpServer = require('http').createServer(app);
const io = new Server(httpServer);

io.on('connection', client => {
    const m1 = 'message-01';
    const m2 = 'message-02';
    console.log('客户端已连接：', client.id);
    client.on('disconnect', () => {
        console.log('客户端断开连接')
        clearInterval(interval);
    });
    let interval;
    // 监听客户端发送过来的不同的消息ID
    client.on(m1, data => {
        // 向客户端发送不同的消息ID
        client.emit(m1, ++data);
    })
    client.on(m2, data => {
        client.emit(m2, +data + 2);
    })
    interval = setInterval(()  => {
        client.emit('real-time', Date.now());
        console.log(1);
    }, 1000);
});
app.get('/', (req, res) => {
    res.render('../client/index.html')
})

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})