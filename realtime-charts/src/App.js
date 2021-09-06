import React, { Component } from 'react';
import { Line, Bar, Chart } from 'react-chartjs-2';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Register the plugin to all charts:
Chart.register(ChartDataLabels);

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

const SUBS_TOTAL_ORDER_CUMMULATIVE= gql`
subscription sub_total_order_cumulative {
  total_order_cumulative (order_by: {product: asc}) {
    product
    sum_product
  }
}
`

class App extends Component {
  render() {
    return(
      <div style={{display: 'flex', 'flex-direction': 'column' , justifyContent: 'center', margin: '20px'}}>
      <div style={{flex: '1' , alignItems: 'center', justifyContent: 'center', margin: '20px'}}>
      <Subscription subscription={SUBS_TOTAL_ORDER_CUMMULATIVE}>
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
                label: "Total Order by Product (Current time)",
                data: [],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
              }]
            };
            data.total_order_cumulative.forEach((item) => {
              chartJSData.datasets[0].data.push(item.sum_product);
              chartJSData.labels.push(item.product);
            });

            return (
              <Bar
                data={chartJSData}
                options={{
                  plugins: {
                    datalabels: {
                       display: true,
                       color: 'black'
                    }
                  },
                  animation: {duration: 0},
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            );
          }
        }
      </Subscription>
      </div>

      <div style={{flex: '2' , alignItems: 'center', justifyContent: 'center', margin: '20px'}}>
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
                  plugins: {
                    datalabels: {
                       display: false
                    }
                  },
                  animation: {duration: 0},
                  scales: { yAxes: [{
                    //type: 'linear',
                    //ticks: { min: 0, max: 100 , callback: function(value) { return value + "%";} },
                    //scaleLabel: {display: true, labelString: "Approval Rate %"}
                  }]}
                }}
              />
            );
          }
        }
      </Subscription>
      </div>
    </div>
    );
  }
};

export default App;
