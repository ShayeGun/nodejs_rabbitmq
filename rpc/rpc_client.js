const amqp = require('amqplib');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('Usage: rpc_client.js num');
  process.exit(1);
}

const correlationId = generateUuid();
const num = parseInt(args[0]);

const sendMsg = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const q = await channel.assertQueue('', { exclusive: true });

    console.log(' [x] Awaiting RPC requests (%d)', num);

    channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
      replyTo: q.queue,
      correlationId,
    });

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.] Got (%s)', msg.content.toString());
          setTimeout(function () {
            connection.close();
            process.exit(0);
          }, 500);
        }
      },
      { noAck: true }
    );
  } catch (err) {
    console.log(err);
  }
};

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

sendMsg();
