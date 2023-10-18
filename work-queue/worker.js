const amqp = require('amqplib');

const queueName = 'task-queue';

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.prefetch(1);
    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      queueName
    );

    channel.consume(
      queueName,
      function (msg) {
        const secs = msg.content.toString().split('.').length - 1;

        console.log(' [x] Received %s', msg.content.toString());
        setTimeout(function () {
          console.log(' [x] Done');
        }, secs * 2000);
      },
      {
        noAck: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

receiveMsg();
