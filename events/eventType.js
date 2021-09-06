import avro from 'avsc';

export default avro.Type.forSchema({
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
            type: 'string'
        },
        {
            name: 'id',
            type: 'string'
        },
    ],
});