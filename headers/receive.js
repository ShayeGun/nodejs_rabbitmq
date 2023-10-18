const amqp = require('amqplib');

const exchangeName = 'headers_logs';

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', {
      durable: false,
    });

    const q = await channel.assertQueue('', {
      exclusive: true,
    });

    await channel.bindQueue(q.queue, exchangeName, '', {
      name: 'shy',
      gender: 'monkey',
      'x-match': 'any',
    });

    // channel.prefetch(1);
    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      q.queue
    );

    channel.consume(
      q.queue,
      function (msg) {
        if (msg.content) {
          console.log(" [x]  ==> '%s'", msg.content);
        }
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
