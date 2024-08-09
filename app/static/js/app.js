function do_work() {
  // User Input
  let season = d3.select("#seasons_filter").property("value");
  // API Request
  let url = `/api/v1.0/get_dashboard/${season}`;
  d3.json(url).then(function (data) {
    // Make Visuals
    make_bar(data.bar_data);
    make_pie(data.pie_data);
    make_table(data.table_data);
    // Error Handling
  }).catch(function(error) {
    console.error('Error fetching data:', error);
  });
}



// Visualizations Functions

// Table Function
function make_table(filtered_data) {
  // Select table from html
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  // Destroy any existing rows
  table_body.html(""); 
  // Create Table
  for (let i = 0; i < filtered_data.length; i++){
    let data_row = filtered_data[i];
    // Append information to our table
    let row = table_body.append("tr");
    row.append("td").text(data_row.yr);
    row.append("td").text(data_row.seasons);
    row.append("td").text(data_row.state);
    row.append("td").text(data_row.category);
    row.append("td").text(data_row.injuries);
    row.append("td").text(data_row.fatalities);
    row.append("td").text(data_row.loss);
    
  }
}

// Pie Function
function make_pie(filtered_data) {
  // Extract Data
  let pie_data = filtered_data.map(x => x.loss);
  let pie_labels = filtered_data.map(x => `cat ${x.category}`);
  // Define custom colors for the pie chart slices
  let custom_colors = [];
  // Build Trace
  let trace1 = {
    values: pie_data,
    labels: pie_labels,
    type: 'pie',
    hoverinfo: 'label+percent+name',
    hole: 0.4,
    name: "Injuries",
    marker: {
      colors: custom_colors
    },
    sort: "ascending"
  }
  // Create Data Array
  let data = [trace1];
  // Apply title
  let layout = {
    title: "($) Losses by Category",
    legend: {
      traceorder: 'reversed'
    }
  }
  // Plot
  Plotly.newPlot("pie_chart", data, layout);
}

// Bar Function
function make_bar(filtered_data) {
  // Extract the x & y values for our bar chart
  let bar_x = filtered_data.map(x => `cat ${x.category}`);
  let bar_y1 = filtered_data.map(x => x.fatalities);
  let bar_y2 = filtered_data.map(x => x.injuries);
  // Trace1 for the Fatalities
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "blue"
    },
    name: "Fatalities",
  };
  // Trace 2 for the Injuries 
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    name: "Injuries",
  };
  // Create Data Array
  let data = [trace1, trace2];
  // Apply a title to the layout
  let layout = {
    title: "Injuries & Fatalities by Category",
    barmode: "group",
    // Include margins so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };
  // Render the plot to the div tag with id "bar_chart"
  Plotly.newPlot("bar_chart", data, layout);
}



// Event Listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// On page load, don't wait for the click to make the graph, use default
document.addEventListener("DOMContentLoaded", function() {
  do_work();
});