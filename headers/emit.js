const amqp = require('amqplib');

const exchangeName = 'headers_logs';
const msg = 'Hello World!';

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', {
      durable: false,
    });
    channel.publish(exchangeName, '', Buffer.from(msg), {
      headers: { name: 'shy', gender: 'male' },
    });
    console.log(" [x] Sent %s: '%s'", msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMsg();
