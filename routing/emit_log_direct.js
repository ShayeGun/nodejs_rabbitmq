const amqp = require('amqplib');

const exchangeName = 'direct_logs';
const args = process.argv.slice(2);
const msg = args.slice(1).join(' ') || 'Hello World!';
const severity = args.length > 0 ? args[0] : 'info';

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {
      durable: false,
    });
    channel.publish(exchangeName, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMsg();
