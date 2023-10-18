const amqp = require('amqplib');

const queueName = 'task-queue';
const msg = process.argv.slice(2).join(' ') || 'hello world';

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.sendToQueue(queueName, Buffer.from(msg), {
      persistent: true,
    });
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
