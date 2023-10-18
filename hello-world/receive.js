const amqp = require('amqplib');

const queueName = 'hello';

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: false,
    });
    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      queueName
    );

    channel.consume(
      queueName,
      function (msg) {
        console.log(' [x] Received %s', msg.content.toString());
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
