// Scatter.js 
// Sammy Heutz, 10445765

window.onload = function() {
	

	// x data: Gross national income per capita in dollar
	// y data: total employment rates
	
	// countries: 20
	// years: 2011-2014 (4 years)
	// jobs etc timeseries
	//var data = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/NATINCCAP_T1+EMPLGNDR_T1C.AUS+AUT+BEL+CAN+CHL+USA+DNK+EST+FIN+FRA+DEU+GRC+MEX+ISL+IRL+ISR+ITA+JPN+KOR+LVA/all?startTime=2011&endTime=2014&pid=7adc5e21-c667-410c-9b9d-c159b98a13bc"
	
	// jobs etc flat
	var data = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/NATINCCAP_T1+EMPLGNDR_T1C.AUS+AUT+BEL+CAN+CHL+USA+DNK+EST+FIN+FRA+DEU+GRC+MEX+ISL+IRL+ISR+ITA+JPN+KOR+LVA/all?startTime=2011&endTime=2014&dimensionAtObservation=allDimensions&pid=7adc5e21-c667-410c-9b9d-c159b98a13bc"
	//	console.log(healthData)
	function callback(data){
	
	console.log(data)
	
	let amountCountries = 20
	let amountYears = 4
	let income2011 = []
	let income2012 = []
	let income2013 = []
	let income2014 = []
	
	let employment2011 = []
	let employment2012 = []
	let employment2013 = []
	let employment2014 = []
	
	// create income and employment array for each year
	for (let i = 0; i < amountCountries; i++){
		
			income2011[i] = data.dataSets["0"].observations["0:" + i + ":0"][0]
			income2012[i] = data.dataSets["0"].observations["0:" + i + ":1"][0]
			income2013[i] = data.dataSets["0"].observations["0:" + i + ":2"][0]
			income2014[i] = data.dataSets["0"].observations["0:" + i + ":3"][0]

			employment2011[i] = data.dataSets["0"].observations["1:" + i + ":0"][0]
			employment2012[i] = data.dataSets["0"].observations["1:" + i + ":1"][0]
			employment2013[i] = data.dataSets["0"].observations["1:" + i + ":2"][0]
			employment2014[i] = data.dataSets["0"].observations["1:" + i + ":3"][0]

			
	};
	
		
	// categorize countries for coloring
	continents = ["Australia", "Europe", "Europe", "America", "Europe", "Europe",
	"Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Asia", "Asia",
	"America", "America", "America", "Europe", "Asia", "Europe"]
	
	// transform arrays into list of list of x and y coordinates
	coordinates2011 = []
	coordinates2012 = []
	coordinates2013 = []
	coordinates2014 = []
	
	for (let i = 0; i < amountCountries; i++){
		coordinates2011.push([income2011[i],employment2011[i],continents[i]])
		coordinates2012.push([income2012[i],employment2012[i],continents[i]])
		coordinates2013.push([income2013[i],employment2013[i],continents[i]])
		coordinates2014.push([income2014[i],employment2014[i],continents[i]])
	};

	
	// create list of values, countries and years
	values = []
	countries = []
	years = []
	for (let i = 0; i < amountCountries; i++){
		countries[i] = data.structure.dimensions.observation[1].values[i].name

	};
	
	
	for (let i = 0; i < amountYears; i++){
				years[i] = data.structure.dimensions.observation[2].values[i].id
	};

	console.log(coordinates2011)
	
	// window
	var margin = {top: 40, right: 40, bottom: 40, left: 60};
	var w =	 window.innerWidth - 200
	var h = window.innerHeight - 200
	var barPadding = 1;
	
	
	// Axes (-1 and +1 to ensure dots do not overlap axes
	var xScale = d3.scale.linear()
      .domain([(d3.min(coordinates2011, function(d)
	  {return d[0]; }))-1000, (d3.max(coordinates2011, function(d)
	  {return d[0]; }))+1000])
      .range([margin.left, (w - margin.right)]);

		var yScale = d3.scale.linear()
      .domain([(d3.max(coordinates2011, function(d)
	  { return d[1]; }))+1, (d3.min(coordinates2011, function(d)
		  {return d[1]; }))-1])
      .range([margin.top, (h - margin.bottom)]);
	  
	var color = d3.scale.category10();
	
	
	  	// setting the axes	
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
	
	// svg element
	var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
	

	//create circles
	svg.selectAll("circle")
		.data(coordinates2011)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
        return xScale(d[0]);
		})
	   .attr("cy", function(d) {
			return yScale(d[1]);
	   })
	   .attr("r", 5)
	   .style("fill", function(d) { return color(d[2]); });
	   
	// create axes
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - margin.bottom) + ")")
		.call(xAxis)
		    .append("text")
      .attr("class", "label")
      .attr("x", w - margin.right)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Gross income per capita");
	  
	  
	svg.append("g")
    .attr("transform", "translate(" + margin.left + ", 0)")
    .call(yAxis)
	   .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Employment rate");
		
	  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", w - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
	  
	   legend.append("text")
      .attr("x", w - 18)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
		
	}


	d3.request(data)
		.get(function(xhr) {callback(JSON.parse(xhr.responseText))});
	};