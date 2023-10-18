const amqp = require('amqplib');

const exchangeName = 'direct_logs';
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: receive_logs_direct.js [info] [warning] [error]');
  process.exit(1);
}

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {
      durable: false,
    });

    const q = await channel.assertQueue('', {
      exclusive: true,
    });

    // channel.prefetch(1);
    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      q.queue
    );

    args.forEach(function (severity) {
      channel.bindQueue(q.queue, exchangeName, severity);
    });

    channel.consume(
      q.queue,
      function (msg) {
        if (msg.content) {
          console.log(
            " [x] %s: '%s'",
            msg.fields.routingKey,
            msg.content.toString()
          );
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
