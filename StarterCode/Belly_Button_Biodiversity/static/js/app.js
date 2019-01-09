function buildMetadata(sample) {
  var url = '/metadata/' + sample;
  // @TODO: Complete the following function that builds the metadata panel
  console.log("sample", sample)
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    selector.append("h4").text(`${key} : ${value}`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  var urll = '/wfreq/' + sample;
  console.log("bonus sample", sample)
  console.log(urll)
  Plotly.d3.json(urll, function(error, wfreq) {
    if (error) return console.warn(error);
    // Enter the washing frequency between 0 and 180
    var level = wfreq*20;
// Enter a speed between 0 and 180

//var level = 2 * 20;
//var level = wfreq * 20;
console.log(wfreq);
// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { 
//  values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
//  rotation: 90,
//  text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average', 'Slow', 'Super Slow', ''],
  values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(0, 105, 11, .5)',
                   'rgba(10, 120, 22, .5)',
                   'rgba(14, 127, 0, .5)', 
                   'rgba(110, 154, 22, .5)',
                   'rgba(170, 202, 42, .5)', 
                   'rgba(202, 209, 95, .5)',
                   'rgba(210, 206, 145, .5)', 
                   'rgba(232, 226, 202, .5)',
                   'rgba(240, 230, 215, .5)',
                   'rgba(255, 255, 255, 0)']},
//  labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
});


}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = '/samples/' + sample;
  console.log("Url", url);
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(data) { 
        console.log("data", data);
    // @TODO: Build a Pie Chart
    var layout = {
      title: "Pie chart"
      };
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var piechart = [{
      values: data.sample_values.slice(0, 11),
      labels: data.otu_ids.slice(0, 11),
      type: "pie"
      }];
      Plotly.newPlot("pie", piechart, layout);
      
      var trace = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      }
      }];
      var layout2 = {
        title: "Bubble Chart",
        showlegend: false
      };
      Plotly.newPlot("bubble", trace, layout2);
    })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
