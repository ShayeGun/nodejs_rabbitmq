const amqp = require('amqplib');

const queue = 'rpc_queue';

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: false,
    });

    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');

    channel.consume(
      queue,
      (msg) => {
        const n = parseInt(msg.content.toString());
        console.log('[.] fib (%d)', n);

        const fib = fibonacci(n);

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(fib.toString()),
          { correlationId: msg.properties.correlationId }
        );

        channel.ack(msg);
      },
      {
        // cuz we are processing data (fibonacci)
        noAck: false,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}

receiveMsg();
