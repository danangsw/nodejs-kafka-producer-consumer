import fetch from 'node-fetch';

setInterval(
    () => {

        const temper = (Math.random() * 5) + 10;
        var vquery = `mutation RandomTemp ($temper:numeric!) {
          insert_temperature (
            objects: [{
              temperature: $temper
              location: "London"
            }]
          ) {
            returning {
              recorded_at
              temperature
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
                query: vquery,
                variables: { temper }
            })
        }).then((resp) => resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2))));
    }
    ,
    2000
);