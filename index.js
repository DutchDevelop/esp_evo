const net = require('net');

const host = '192.168.9.69';
const port = 2000; // Default port as defined in Python code

function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let responseData = '';

    client.connect(port, host, () => {
      client.write(command);
    });

    client.on('data', (data) => {
      responseData += data.toString();
      client.destroy(); // kill client after server's response`
    });

    client.on('close', () => {
      resolve(responseData);
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
}

async function getData() {
  const commands = [
    "\x1bRD90005f", // GET_STATUS
    "\x1bRD100057", // GET_TEMPERATURE
    "\x1bRD300059", // GET_POWERLEVEL
    "\x1bRD40005A", // GET_PELLETSPEED
    "\x1bRDA00067&", // GET_ERRORSTATE
    "\x1bREF0006D&", // GET_EXHFANSPEED
    "\x1bRD000056", // GET_FLUGASTEMP
    "\x1bRC60005B&", // GET_SETPOINT (Optional, based on SUPPORT_SETPOINT in your code)
  ];

  try {
    for (const command of commands) {
      const response = await sendCommand(command);
      console.log(`Response for command ${command}: ${response}`);
    }
  } catch (err) {
    console.error('Error communicating with stove:', err);
  }
}

console.log("Trying to receive data");
getData();
