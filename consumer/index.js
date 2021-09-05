console.log('consumer is running...')
import fetch from 'node-fetch';
import Kafka from 'node-rdkafka';
import EventType from '../events/eventType';

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

    saveDataOrder(data.value);
});

function saveDataOrder(order) {
    var id = order.id;
    var branch = order.branch;
    var product = order.product;
    var quantity = order.quantity;
    var order_date = order.order_date;
    var approval_date = order.approval_date;
    var approval_status = getApproval();

    var mut_query = `mutation mut_appl_order($id:String!, 
                     $branch:String!, $product:String!, 
                     $quantity:numeric!, $order_date: String!, 
                     $approval_date: String!, $approval_status: String!) {
        insert_appl_order(objects: [
            {
                id: $id, 
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
                variables: {id, branch, product, quantity, order_date, approval_date, approval_status}
            })
        }).then((resp) => resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2))));
}

function getApproval() {
    var symbols= ['AP', 'RE'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}   