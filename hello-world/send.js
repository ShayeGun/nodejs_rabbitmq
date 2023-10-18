const amqp = require('amqplib');

const queueName = 'hello';
const msg = 'hello world!';

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: false,
    });
    channel.sendToQueue(queueName, Buffer.from(msg));
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
