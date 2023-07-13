// Use the D3 library to read in samples.json from the URL
// Assign url to constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//  Assign the fetched JSON data to a variable for repeated use and console log it.
let promise = d3.json(url);
console.log(promise);


//Establish function (with parameter) for building Demographic Information
function metaDataInfo(id) {

  // call the sample data into a callback function and assign to temporary variable
  promise.then(function (data) {
    // pull metadata from the sample data and assign to variable
    let metaData = data.metadata;

    // from the metadata, filter for only the metadata associated with the id in current itteration
    let filterID = metaData.filter(value => value.id == id)[0];

    // use d3 to select the sample-metadata id element in the html file and assign to a variable
    let infoDisplay = d3.select('#sample-metadata');
    
    //clear the html content within the infoDisplay sample metadata id
    infoDisplay.html('');
    // use Object.entries to pass Key-Value pairs in filterID dictionary into individual arrays
    Object.entries(filterID)
      // string with forEach to itterate through each array and use callback function to extract each Key and Value
      .forEach(([key, value]) => {
        // then append the h5 formatting tag to html and pass the Key and Value data as text to display on the html page
        infoDisplay.append('h5')
        .text(`${key}: ${value}`);
      })

  })
};
// test function with first name/id in the dataset
// metaDataInfo('940');

//Establish function (with parameter) for building Demographic Information
function charts(id) {
  // call the sample data into a callback function and assign to temporary variable
  promise.then(function (data) {

    // Prep the data for the bar and bubble charts
    // Establish the data set and parse down each piece of data that will be used in the charts
    let sampleData = data.samples;
    let filterID = sampleData.filter(value => value.id == id);
    let subject = filterID[0];

    //pull values 0 - 9 and save them to variables in reverse order
    let otuIDs = subject.otu_ids.slice(0, 10).reverse();
    let sampleValue = subject.sample_values.slice(0, 10).reverse();
    let labels = subject.otu_labels.slice(0, 10).reverse();


    //bar
    // Trace for bar plot
    let trace1 = {
      x: sampleValue,
      // adding "'OTU ' +" map numbers to string, it confines them to the 10 sliced items
      y: otuIDs.map(object => 'OTU ' + object),
      text: labels,
      type: 'bar',
      orientation: 'h'
    };

    // Data trace array
    let traceData = [trace1]

    // Apply the group barmode to the layout
    let layout = {
      title: "Belly Button"

    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot('bar', traceData, layout);

    //bubble
    // Trace for bubble plot
    let trace2 = {
      x: subject.otu_ids,
      y: subject.sample_values,
      mode: 'markers',
      marker: {
        size: subject.sample_values,
        color: subject.otu_ids,
        colorscale: 'Earth'

      },
      text: subject.otu_labels
    };
    // Data trace array
    let bubbleData = [trace2];

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', bubbleData)
  });
}
// test function with first name/id in the dataset
// charts('940')

// Function is called and the value is passed when a change is made to the 'optionChanged' tag
function optionChanged(id) {
  charts(id);
  metaDataInfo(id)
};

// Function for initializing the page
function init() {
  promise.then(function (data) {
    //select the selDataset id dropdown and assign to variable
    let dropDown = d3.select("#selDataset")

    //store all 'names' vales in a variable
    let names = data.names;

    // for loop iterates through each item in the names variable, 
        for (let i = 0; i < names.length; i++) {
      //appends an "option" tag within "#selDataset", adds a value equal to the name variable of the current itteration,
      //adds the text string content equal to the name variable of the current itteration, 
      dropDown.append("option").text(names[i]).property("value", names[i]);
    }
    
    // triggers charts() and metaDataInfo() functions with the 0th value of the names data as the parameter
    charts(names[0]);
    metaDataInfo(names[0])

  });

  
}

// initialize the page by triggering the init() function
init();