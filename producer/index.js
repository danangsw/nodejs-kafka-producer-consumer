import Kafka from 'node-rdkafka';
import EventType from '../events/eventType.js'

console.log('producer is running...');

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'},
    {}, {'topic': 'aplikasi'});

function queueMsg() {
    var oid = generateSimpleId();
    //Javascript Date to Postgres-acceptable format
    //https://gist.github.com/jczaplew/f055788bf851d0840f50
    var odate = new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z','');
    var obranch = getBranch();
    var oproduct = getProduct();

    const eventOrder = { branch: obranch, product: oproduct, quantity: 1, orderDate: odate, id: oid}
    const success = stream.write(EventType.toBuffer(eventOrder));
    if(success)
    {
        console.log(`Stream write success, for id ${oid} at ${odate}`);
    }
    else
    {
        console.log('Stream write error...');
    }
}

function getBranch() {
    var symbols= ['Jakarta', 'Bandung', 'Semarang', 'Denpasar'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getProduct() {
    var symbols= ['MOTOR', 'MOBIL', 'DURABLE'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}   

function generateSimpleId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

setInterval(() => {
    queueMsg();
}, 1000);