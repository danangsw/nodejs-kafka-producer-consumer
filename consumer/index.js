const Kafka = require('node-rdkafka');
const EventType = require('../eventType.js');

console.log('consumer is running...')

const consumer = Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092'},
    {});

consumer.connect();

consumer.on('ready', () => {
    console.log('consumer ready!');
    consumer.subscribe(['aplikasi']);
    consumer.consume();
}).on('data', (data) => {
    console.log(`stream received ${EventType.fromBuffer(data.value)}`);
});