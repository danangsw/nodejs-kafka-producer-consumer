import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const SUBS_APPROVAL_RATE_30_MINS= gql`
subscription sub_approval_rate {
  last_30_min_approval_rate(
    order_by: {
      sec_interval: asc
    }
    where: {
      approval_status: {
        _eq: "AP"
      }
    }
  ) {
    sec_interval
    approval_status
    approval_rate
  }
}
`

class App extends Component {
  render() {
    return(
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px'}}>
      <Subscription subscription={SUBS_APPROVAL_RATE_30_MINS}>
        {
          ({data, error, loading}) => {
            if (error) {
              console.error(error);
              return "Error";
            }
            if (loading) {
              return "Loading";
            }
            
            let chartJSData = {
              labels: [],
              datasets: [{
                label: "Kredit Approval Rate (Last 30 Minutes)",
                data: [],
                pointBackgroundColor: [],
                borderColor: 'green',
                fill: true
              }]
            };

            data.last_30_min_approval_rate.forEach((item) => {
              const humanReadableTime = moment(item.sec_interval).format('LTS');
              chartJSData.labels.push(humanReadableTime);
              chartJSData.datasets[0].data.push(item.approval_rate);
              chartJSData.datasets[0].pointBackgroundColor.push('brown');
            });

            return (
              <Line
                data={chartJSData}
                options={{
                  animation: {duration: 1},
                  scales: { y: [{
                    type: 'linear',
                    ticks: { min: 0, max: 100 , callback: function(value) { return value + "%";} },
                    scaleLabel: {display: true, labelString: "Approval Rate %"}
                  }]}
                }}
              />
            );
          }
        }
      </Subscription>
    </div>
    );
  }
};

export default App;
