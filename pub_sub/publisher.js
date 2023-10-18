const amqp = require('amqplib');

const exchangeName = 'logs';
const msg = process.argv.slice(2).join(' ') || 'hello world';

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });
    channel.publish(exchangeName, '', Buffer.from(msg));
    console.log(' [x] Sent : %s', msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMsg();
