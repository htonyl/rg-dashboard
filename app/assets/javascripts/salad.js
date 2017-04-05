/*
 *  Home view for Salad:
 *  - bar chart
 *  - pie chart
 *
 */
// PIE
$(function () {
  $('span.pie').peity('pie', {
    fill: ['#1ab394', '#d7d7d7', '#ffffff'],
  });

  var d1 = [[1262304000000, 6], [1264982400000, 3057], [1267401600000, 20434],
    [1270080000000, 31982], [1272672000000, 26602], [1275350400000, 27826],
    [1277942400000, 24302], [1280620800000, 24237], [1283299200000, 21004],
    [1285891200000, 12144], [1288569600000, 10577], [1291161600000, 10295]];
  var d2 = [[1262304000000, 5], [1264982400000, 200], [1267401600000, 1605],
    [1270080000000, 6129], [1272672000000, 11643], [1275350400000, 19055],
    [1277942400000, 30062], [1280620800000, 39197], [1283299200000, 37000],
    [1285891200000, 27000], [1288569600000, 21000], [1291161600000, 17000]];

  var data1 = [
    { label: "Data 1", data: d1, color: '#17a084' },
    { label: "Data 2", data: d2, color: '#127e68' }
  ];
  $.plot($("#flot-chart1"), data1, {
      xaxis: {
          tickDecimals: 0
      },
      series: {
          lines: {
              show: true,
              fill: true,
              fillColor: {
                  colors: [{
                      opacity: 1
                  }, {
                      opacity: 1
                  }]
              },
          },
          points: {
              width: 0.1,
              show: false
          },
      },
      grid: {
          show: false,
          borderWidth: 0
      },
      legend: {
          show: false,
      }
  });

  var lineData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
          {
              label: "Example dataset",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 40, 51, 36, 25, 40]
          },
          {
              label: "Example dataset",
              fillColor: "rgba(26,179,148,0.5)",
              strokeColor: "rgba(26,179,148,0.7)",
              pointColor: "rgba(26,179,148,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(26,179,148,1)",
              data: [48, 48, 60, 39, 56, 37, 30]
          }
      ]
  };

  var lineOptions = {
      scaleShowGridLines: true,
      scaleGridLineColor: "rgba(0,0,0,.05)",
      scaleGridLineWidth: 1,
      bezierCurve: true,
      bezierCurveTension: 0.4,
      pointDot: true,
      pointDotRadius: 4,
      pointDotStrokeWidth: 1,
      pointHitDetectionRadius: 20,
      datasetStroke: true,
      datasetStrokeWidth: 2,
      datasetFill: true,
      responsive: true,
  };

  var ctx = document.getElementById("lineChart").getContext("2d");
  var myNewChart = new Chart(ctx).Line(lineData, lineOptions);

});

// Bar Utils

function getBarData(labels, data){
  // run multiple datasets
  return {
      labels: labels,
      datasets: [
          {
              label: "Dataset",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: data
          }
      ]
  };
}
function getBarOptions(){
  return {
    scaleBeginAtZero: true,
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(0,0,0,.05)",
    scaleGridLineWidth: 1,
    barShowStroke: true,
    barStrokeWidth: 2,
    barValueSpacing: 5,
    barDatasetSpacing: 1,
    responsive: true,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          console.log(tooltipItem, data);
          return data+"€";
        }
      }
    }
  };
}
function calculateWeek(timeString, init){
    var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Math.floor((
      (parseInt(timeString.substring(0, 4)) - init.y) * 365
        + month.slice(init.m - 1, parseInt(timeString.substring(5, 7)) - 1).reduce(
            function(prev, cur){ return prev + cur; }) +
        + parseInt(timeString.substring(8, 10)) - init.d
    ) / 7);
}

function getCumulative(data){
  var sum = 0;
  var cumulative = data.map(function(val){
    return 1 - (sum+=val);
  });
  cumulative.unshift(1);
  cumulative.pop();
  return cumulative;
}

function countDurationPeriodBased(data, start, end){
  var userToDuration = Array(24).fill(0);
  var base = Object.keys(data).length;
  for (var userID in data){
    var freqInSpan = 0, durationInSpan = 0;
    for (var week in data[userID]){
      if(week >= start && week <= end){
        freqInSpan+=data[userID][week].freq;
        durationInSpan+=data[userID][week].duration;
      }
    }
    if(!freqInSpan) base--; // zero duration is not counted
    userToDuration[Math.round(durationInSpan/freqInSpan)]++;
  }
  var res = userToDuration.map(function(userCount){
    return userCount / base;
  });
  return res;
}
function countDurationUserBased(data, start, end){
  var userToDuration = Array(24).fill(0);
  var base = Object.keys(data).length;
  for (var userID in data){
    var freqInSpan = 0, durationInSpan = 0;
    var firstWeek = Number.MAX_SAFE_INTEGER;
    for (var tmp in data[userID]){
      tmp = parseInt(tmp);
      if(tmp < firstWeek) firstWeek = tmp;
    }
    for (var week in data[userID]){
      var weekTransformed = week - firstWeek;
      if(weekTransformed >= start && weekTransformed <= end){
        freqInSpan+=data[userID][week].freq;
        durationInSpan+=data[userID][week].duration;
      }
    }
    if(!freqInSpan) base--; // zero duration is not counted
    userToDuration[Math.round(durationInSpan/freqInSpan)]++;
  }
  return userToDuration.map(function(userCount){
    return userCount / base;
  });
}
// process from toWEEK() or do calculations here
function countFreqPeriodBased(data, start, end){
  console.log("countFreq", data, start, end);
  var base = 0;
  var userToFreq = Array((end-start+1)*7).fill(0);
  for (var userID in data){
    var freqInSpan = 0;
    var firstWeek = Number.MAX_SAFE_INTEGER;
    var lastWeek = Number.MIN_SAFE_INTEGER;
    for (var tmp in data[userID]){
      tmp = parseInt(tmp);
      if(tmp < firstWeek) firstWeek = tmp;
      if(tmp > lastWeek) lastWeek = tmp;
    }
    if(lastWeek < start || firstWeek > end) continue;
    for (var week in data[userID]){
      if(week >= start && week <= end)
        freqInSpan+=data[userID][week].freq;
    }
    base++;
    userToFreq[freqInSpan]++;
  }
  var res = userToFreq.map(function(userCount){
    return userCount / base;
  });
  console.log(res, base);
  return res;
}

function countFreqUserBased(data, start, end){
  var userToFreq = Array((end-start+1)*7).fill(0);
  var base = Object.keys(data).length;
  for (var userID in data){
    var freqInSpan = 0;
    var firstWeek = Number.MAX_SAFE_INTEGER;
    for (var tmp in data[userID]){
      tmp = parseInt(tmp);
      if(tmp < firstWeek) firstWeek = tmp;
    }
    for (var week in data[userID]){
      var weekTransformed = week - firstWeek;
      if(weekTransformed >= start && weekTransformed <= end)
        freqInSpan+=data[userID][week].freq;
    }
    userToFreq[freqInSpan]++;
  }
  var res = userToFreq.map(function(userCount){
    return userCount / base;
  });
  console.log(res);
  return res;
}
// {'_userID_':{'_week_':{duration: 3, freq: 1}}}
function toWeeks(raw){
  var result = {};
  for (var userID in raw.userInfo){
    // skip loop if the property is from prototype
    if (!raw.userInfo.hasOwnProperty(userID)) continue;

    var _user = result[userID] = {};
    raw.userInfo[userID].time.forEach(function(record){
      var week = Math.floor(record.day/7);
      if(week in _user){
        _user[week].freq++;
        _user[week].duration+=record.timeOfDay.length;
      }else{
        _user[week] = {freq: 1, duration: record.timeOfDay.length};
      }
    });
  }
  console.log(result);
  return result;
}

function getData(wrapper, weekList, options, fn) {
  var params = $.extend({}, options);
  var nonCumulative = fn(weekList, params.start, params.end());
  var data = !params.cumulative ? getCumulative(nonCumulative) : nonCumulative;
  return { start: params.start, end: params.end(), data: data };
}
function formatDurationX(){
  for(var i = 0, label=[]; i<=24; i++)
    label.push(i + " h");
  return label;
}
function formatFreqX(start, end){
  for(var i = 0, label=[]; i<=(end-start)*7; i++)
    label.push(i + " d");
  return label;
}
function BarChart(members){
  this.members = members || {};
  var that = this, m = this.members;
  // bind elements
  m.wrapper = $('#'+m.id+'BarChartWrapper');
  m.container = $('#'+m.id+'BarChartContainer');
  m.canvasId = m.id+'BarChart';
  // init slider
  m.wrapper.find("[name='slider-value']")
    .html(m.wrapper.find("[name='slider']").val());
  // mount cumulative button listener
  m.wrapper.find("[name='cumulative']").on('click', function(e){
    that.drawChart({cumulative: $(this).hasClass('active')});
  });
  // mount slider listener
  m.wrapper.find("[name='slider']").on('change', function(e){
    m.wrapper.find("[name='slider-value']").html($(this).val());
    that.drawChart();
  });
}
BarChart.prototype.drawChart = function(options){
  var m = this.members;
  // console.log('before', m.custom);
  m.custom = $.extend(m.custom, options);
  // console.log('after', m.custom);
  var dataObj = getData(m.wrapper, m.weekList, m.custom, m.countFunc);
  label = m.formatX(dataObj.start, dataObj.end);
  m.container.empty();
  m.container.append("<canvas id=\'" + m.canvasId + "\'></canvas>");
  console.log(dataObj.data);
  return new Chart(document.getElementById(m.canvasId).getContext("2d"))
    .Bar(
      getBarData(label, dataObj.data),
      getBarOptions());
};
