import avro from 'avsc';

const EventType = avro.Type.forSchema({
    type: 'record',
    fields: [
        {
            name: 'branch',
            type: {type: 'enum', symbols: ['Jakarta', 'Bandung', 'Semarang', 'Denpasar']}
        },
        {
            name: 'product',
            type: {type: 'enum', symbols: ['MOTOR', 'MOBIL', 'DURABLE']}
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'orderDate',
            type: 'long',
            logicalType: 'timestamp-millis'
        },
        {
            name: 'id',
            type: 'string'
        },
    ],
});

module.exports = EventType;