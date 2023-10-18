const amqp = require('amqplib');

const exchangeName = 'topic_logs';
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>');
  process.exit(1);
}

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', {
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

    args.forEach(function (key) {
      channel.bindQueue(q.queue, exchangeName, key);
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
