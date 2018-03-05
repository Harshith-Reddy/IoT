$(document).ready(function () {
  var timeData = [],
    decibelData = [],
    motionData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Decibel Level',
        yAxisID: 'tmax',
            borderColor: "rgba(0,204,0, 1)",
            pointBoarderColor: "rgba(0,204,0, 1)",
            backgroundColor: "rgba(0,204,0, 0.4)",
            pointHoverBackgroundColor: "rgba(0,204,0, 1)",
            pointHoverBorderColor: "rgba(0,204,0, 1)",
            data: decibelData
      },
      {
        fill: false,
        label: 'Motion Sensor',
        yAxisID: 'tmin',
          borderColor: "rgba(228, 0, 120, 1)",
          pointBoarderColor: "rgba(228, 0, 120, 1)",
          backgroundColor: "rgba(228, 0, 120, 0.4)",
          pointHoverBackgroundColor: "rgba(228, 0, 120 1)",
          pointHoverBorderColor: "rgba(228, 0, 120, 1)",
          data: motionData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Baby Motion Sensor & decibel levels Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'tmax',
        type: 'linear',
        scaleLabel: {
          labelString: 'decibel meter (dB)',
          display: true
        },
        position: 'left',
      }, {
          id: 'tmin',
          type: 'linear',
          scaleLabel: {
              labelString: 'Motion Sensor',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('ws://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.tmax) {
        return;
      }
      timeData.push(obj.time);
        decibelData.push(obj.tmax);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
          decibelData.shift();
      }

        if (obj.humidity) {
            motionData.push(obj.humidity);
        }
        if (motionData.length > maxLen) {
            motionData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
