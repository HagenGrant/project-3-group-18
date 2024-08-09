function do_work() {
  // extract user input
  let season = d3.select("#seasons_filter").property("value");
  
  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${season}`;
  d3.json(url).then(function (data) {

    // create the graphs
    make_bar(data.bar_data);
    make_pie(data.pie_data);
    make_table(data.table_data);
  }).catch(function(error) {
    console.error('Error fetching data:', error);
  });
}

function make_table(filtered_data) {
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows

  // create table
  for (let i = 0; i < filtered_data.length; i++){
    // get data row
    let data_row = filtered_data[i];

    // creates new row in the table
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

function make_pie(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.injuries - a.injuries));

  // extract data for pie chart
  let pie_data = filtered_data.map(x => x.injuries);
  let pie_labels = filtered_data.map(x => x.category);

  let trace1 = {
    values: pie_data,
    labels: pie_labels,
    type: 'pie',
    hoverinfo: 'label+percent+name',
    hole: 0.4,
    name: "Injuries"
  }

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "Tornado Info",
  }

  Plotly.newPlot("pie_chart", data, layout);
}

function make_bar(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.seasons - a.seasons));

  // extract the x & y values for our bar chart
  let bar_x = filtered_data.map(x => `cat ${x.category}`);
  let bar_y1 = filtered_data.map(x => x.fatalities);
  let bar_y2 = filtered_data.map(x => x.injuries);

  // Trace1 for the Seasons
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    bar_text: bar_y1,
    name: "Fatalities"
  };

  // Trace 2 for the Casualties 
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "firebrick"
    },
    name: "Injuries"
  };

  // Create data array
  let data = [trace1, trace2];

  // Apply a title to the layout
  let layout = {
    title: "Tornado Results",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
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

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
document.addEventListener("DOMContentLoaded", function() {
  do_work();
});