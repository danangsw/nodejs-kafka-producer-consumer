console.log('consumer is running...')
import fetch from 'node-fetch';
import Kafka from 'node-rdkafka';
import EventType from '../events/eventType.js';

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
    var datastream = EventType.fromBuffer(data.value);
    console.log(`stream received ${datastream}`);

    saveDataOrder(datastream);
});

function saveDataOrder(order) {
    var oid = order.id;
    var branch = order.branch;
    var product = order.product;
    var quantity = order.quantity;
    var order_date = order.orderDate;
    //Javascript Date to Postgres-acceptable format
    //https://gist.github.com/jczaplew/f055788bf851d0840f50
    var approval_date = new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z','');
    var approval_status = getApproval();

    console.log(order, order_date, approval_date, approval_status)

    var mut_query = `mutation mut_appl_order($oid:String!, 
                     $branch:String!, $product:String!, 
                     $quantity:Int!, $order_date: timestamptz!, 
                     $approval_date: timestamptz!, $approval_status: String!) {
        insert_appl_order(objects: [
            {
                id: $oid, 
                branch: $branch, 
                product: $product, 
                quantity: $quantity, 
                order_date: $order_date, 
                approval_date: $approval_date, 
                approval_status: $approval_status}]) {
          returning {
            quantity
            recorded_at
            approval_status
            id
          }
        }
      }`;

    fetch( `http://localhost:8282/v1alpha1/graphql`,
        {
            method: 'POST',
            headers: {
                "x-hasura-admin-secret": "mylongsecretkey"
            },
            body: JSON.stringify({
                query: mut_query,
                variables: {oid, branch, product, quantity, order_date, approval_date, approval_status}
            })
        }).then((resp) => resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2))));
}

function getApproval() {
    var symbols= ['AP', 'RE'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}   