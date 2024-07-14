// 计算两个经纬度之间的距离
exports.haversineDistance = (lat1, lon1, lat2, lon2) => {
    // 将度数转换为弧度
    const toRadians = (degree) => degree * (Math.PI / 180);

    // 地球的半径（单位：公里）
    const R = 6371;

    // 计算经纬度差值，并转换为弧度
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // 将起点和终点的纬度转换为弧度
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);

    // Haversine 公式
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 计算距离
    const distance = R * c;
    return distance;
}

/* // 示例
const lat1 = 40.712776; // 纽约的纬度
const lon1 = -74.005974; // 纽约的经度
const lat2 = 34.052235; // 洛杉矶的纬度
const lon2 = -118.243683; // 洛杉矶的经度

const distance = haversineDistance(lat1, lon1, lat2, lon2);
console.log(`The distance between the two points is ${distance.toFixed(2)} kilometers.`); */
