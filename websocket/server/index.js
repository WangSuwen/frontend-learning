const express = require('express')
const {Server} = require('socket.io');
const cors = require('cors');
const path = require('path');
const { haversineDistance } = require('./utils');

const app = express()
app.use(cors());
const port = 3989
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

app.get('/report', (req, res) => {
    res.render('../client/report.ejs', {
        noPager: false,
        reportNo: '1234567890',
        stationName: 'asdff',
        testCompanys: [
            {
                companyName: 'asdff',
            }
        ],
        issue: '',
        issueTime: new Date(),
        publishDate: new Date(),
        testDate: new Date(),
        endTime: new Date(),
        startTime: new Date(),
        weather: '晴',
        tempuature: '25',
        wetness: 12,
        testAddress: '123',
        device: {
            name: 'asdf',
            mainDevice: {
                type: '123',
                no: '1234',
                calibrationInstitution: '1234',
                calibrationTerm: '123',
                calibrationCertificateNo: '123'
            },
            camera: {
                type: '123',
                no: '11234'
            }
        },
        result: '1234',
        establishment: '123',
        reviewer: '1324',
        establishmentTime: new Date(),
        reviewerTime: new Date(),
        resultTableLength: 12,
        reportTestPointImage: '1234',
        reportTestSpectrumMapImages: [],
        reportSenceImages: []
    });
});

function getHeapInfo () {
    const v8 = require('v8');

    // 查看当前堆内存的使用情况
    const memoryUsage = process.memoryUsage();
    console.log('\nMemory Usage:');
    console.log(`RSS: ${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`);
    console.log(`External: ${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`);

    // 查看当前设置的堆内存限制
    const heapStatistics = v8.getHeapStatistics();
    console.log('\nHeap Statistics:');
    console.log(`Total Heap Size: ${Math.round(heapStatistics.total_heap_size / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Total Heap Size Executable: ${Math.round(heapStatistics.total_heap_size_executable / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Total Physical Size: ${Math.round(heapStatistics.total_physical_size / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Total Available Size: ${Math.round(heapStatistics.total_available_size / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Used Heap Size: ${Math.round(heapStatistics.used_heap_size / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Heap Size Limit: ${Math.round(heapStatistics.heap_size_limit / 1024 / 1024 * 100) / 100} MB`);

}

// 获取两个经纬度间的距离
app.get('/jingweidu-juli', (req, res) => {

    // getHeapInfo();


    const stationNum = req.query.stationNum || 0;
    const ajson = require('./lib/lt.json');
    const towerJson = require('./lib/tower.json');
    const result = [];
    towerJson.data.forEach(tower => {
        ajson.data.forEach(aj => {
            const distance = haversineDistance(tower[1], tower[0], aj[1], aj[0]);
            if (distance * 1000 <= 50) {
                // console.log(distance);
                result.push(`铁塔：${tower[0]}, ${tower[1]}  - 基站：${aj[0]}, ${aj[1]} 间的距离是： ${distance}`);
            }
        });
        /* const distance = haversineDistance(tower[1], tower[0], ajson.data[stationNum][1], ajson.data[stationNum][0]);
        distance * 1000 <= 50 && result.push(`铁塔：${tower[0]}，${tower[1]}  - 基站：${ajson.data[stationNum][0]}，${ajson.data[stationNum][1]} 间的距离是： ${distance.toFixed(2)}km`); */
    });
    res.json(result);
});

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})