const WebSocket = require('ws');
const axios = require('axios');

// اسم العميل الذي سيتطابق مع المسار في الخادم
const clientId = 'myapp'; // مثل: http://yourrelay.com/myapp

// عنوان السيرفر المركزي
const relayUrl = `wss://portlife.easyfast.cloud/${clientId}`; 

// عنوان السيرفر المحلي
const localTarget = 'http://localhost';

const ws = new WebSocket(relayUrl);

ws.on('open', () => {
  console.log(`✅ Connected to relay server as [${clientId}]`);
});

ws.on('message', async (data) => {
    try {
      data = JSON.parse(data.toString());
  



      const fullUrl = localTarget + data.url;
  
      let axiosConfig = { headers:data.headers };
      if (data.responseType === 'arraybuffer') {
        axiosConfig.responseType = 'arraybuffer';
      }
      
      console.log('body : ',data.body);
     if(data.body){
      if(Object.keys(data.body).length === 0){
          
         delete axiosConfig.headers['content-type'];
         delete axiosConfig.headers['content-length'];
          
        }
     }
      let response;
      if (data.method === 'GET') {
        response = await axios.get(fullUrl, axiosConfig);
      } else if (data.method === 'POST') {
        response = await axios.post(fullUrl, data.body, axiosConfig);
      }
      else if (data.method === 'OPTIONS') {
        response = await axios.options(fullUrl, axiosConfig);
      }
      else if (data.method === 'DELETE') {
        response = await axios.delete(fullUrl, axiosConfig);
      }
      else if (data.method === 'PATCH') {
        response = await axios.patch(fullUrl, data.body, axiosConfig);
      }
      else if (data.method === 'PUT') {
        response = await axios.put(fullUrl, data.body, axiosConfig);
      }
      
        
  
      if (data.responseType === 'arraybuffer') {
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const base64Body = Buffer.from(response.data).toString('base64');
  
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            data: base64Body,
            contentType,
            error: false,
            requestId: data.requestId,
            responseType: data.responseType
          }));
        }
        return;
      }
  
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          data: response.data,
          contentType: response.headers['content-type'] || 'application/json',
          error: false,
          requestId: data.requestId,
          responseType: data.responseType
        }));
      }
    } catch (err) {
      console.error('❌ Error:', err.message);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          error: err.message,
          requestId: data.requestId,
          responseType: data?.responseType || 'json'
        }));
      }
    }
  });
  