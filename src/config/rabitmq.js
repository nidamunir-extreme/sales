const amqp = require("amqplib");

// RabbitMQ connection URL
const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";

// Queue name for daily sales report
const DAILY_SALES_REPORT_QUEUE = "daily_sales_report";

/**
 * Connect to RabbitMQ
 */
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    // Ensure the queue exists
    await channel.assertQueue(DAILY_SALES_REPORT_QUEUE, {
      durable: true, // Queue will survive broker restarts
    });

    console.log("Connected to RabbitMQ");

    return { connection, channel };
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
};

/**
 * Send a message to the queue
 */
const sendToQueue = async (queueName, message) => {
  try {
    const { channel } = await connectRabbitMQ();

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true } // Message will survive broker restarts
    );

    console.log(`Message sent to queue: ${queueName}`);

    // Close the channel and connection
    setTimeout(() => {
      channel.close();
      // Connection will close automatically when all channels are closed
    }, 500);

    return true;
  } catch (error) {
    console.error("Error sending message to queue:", error);
    throw error;
  }
};

/**
 * Start consuming messages from the queue
 */
const consumeQueue = async (queueName, callback) => {
  try {
    const { channel } = await connectRabbitMQ();

    console.log(`Waiting for messages from queue: ${queueName}`);

    channel.consume(
      queueName,
      (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log(`Received message from queue: ${queueName}`);

          // Process the message
          callback(content);

          // Acknowledge the message
          channel.ack(msg);
        }
      },
      { noAck: false } // Manual acknowledgment
    );
  } catch (error) {
    console.error("Error consuming queue:", error);
    throw error;
  }
};

module.exports = {
  connectRabbitMQ,
  sendToQueue,
  consumeQueue,
  DAILY_SALES_REPORT_QUEUE,
};
