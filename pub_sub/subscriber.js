const amqp = require('amqplib');

const exchangeName = 'logs';

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });

    const q = await channel.assertQueue('', {
      exclusive: true,
    });

    console.log(q);

    channel.prefetch(1);
    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      q.queue
    );

    await channel.bindQueue(q.queue, exchangeName, '');

    channel.consume(
      q.queue,
      function (msg) {
        if (msg.content) {
          const secs = msg.content.toString().split('.').length - 1;

          console.log(' [x] Received %s', msg.content.toString());
          setTimeout(function () {
            console.log(' [x] Done');
          }, secs * 2000);
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
