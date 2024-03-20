const socket = io('http://127.0.0.1:3000');

  // client-side
  socket.on("connect", () => {
    console.log('链接成功：', socket.id); // x8WIv7-mJelg7on_ALbx
  });
  
  socket.on("disconnect", () => {
    console.log('已断开链接---', socket.id); // undefined
  });