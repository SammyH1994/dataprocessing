/* Scatter.js creates a scatterplot using data from OECD. The data consists
of the incomes and employment rates from a number of countries from 2011-2014.

Sammy Heutz, 10445765
*/

window.onload = function() {	
	
	// help from: http://bl.ocks.org/jfreels/6871643
	
	// retrieve data from OECD API
	let data = "https://stats.oecd.org/SDMX-JSON/data/CSPCUBE/NATINCCAP_T1+EMPLGNDR_T1C.AUS+AUT+BEL+CAN+CHL+USA+DNK+EST+FIN+FRA+DEU+GRC+MEX+ISL+IRL+ISR+ITA+JPN+KOR+LVA/all?startTime=2011&endTime=2014&dimensionAtObservation=allDimensions&pid=7adc5e21-c667-410c-9b9d-c159b98a13bc"

	function callback(data){

	let amountCountries = Object.keys(data.structure.dimensions.observation[1].values).length;
	
	countries = [];

	// create array of country names
	for (let i = 0; i < amountCountries; i++){
		countries[i] = data.structure.dimensions.observation[1].values[i].name;
	};
	
	// categorize countries for coloring and legend (unfortunately manually)
	continents = ["Australia", "Europe", "Europe", "America", "Europe", "Europe",
	"Europe", "Europe", "Europe", "Europe", "Europe", "Europe", "Asia", "Asia",
	"America", "America", "America", "Europe", "Asia", "Europe"];

	let income2011 = [];
	let income2012 = [];
	let income2013 = [];
	let income2014 = [];
	let employment2011 = [];
	let employment2012 = [];
	let employment2013 = [];
	let employment2014 = [];
	
	// create income and employment array for each year
	for (let i = 0; i < amountCountries; i++){
		
			income2011[i] = data.dataSets["0"].observations["0:" + i + ":0"][0];
			income2012[i] = data.dataSets["0"].observations["0:" + i + ":1"][0];
			income2013[i] = data.dataSets["0"].observations["0:" + i + ":2"][0];
			income2014[i] = data.dataSets["0"].observations["0:" + i + ":3"][0];
			employment2011[i] = data.dataSets["0"].observations["1:" + i + ":0"][0];
			employment2012[i] = data.dataSets["0"].observations["1:" + i + ":1"][0];
			employment2013[i] = data.dataSets["0"].observations["1:" + i + ":2"][0];
			employment2014[i] = data.dataSets["0"].observations["1:" + i + ":3"][0];		
	};

	coordinates2011 = [];
	coordinates2012 = [];
	coordinates2013 = [];
	coordinates2014 = [];
	
	// transform arrays into x and y coordinate arrays
	for (let i = 0; i < amountCountries; i++){
		if (countries[i] === "United States"){
		countries[i] = "US"}
		coordinates2011.push([income2011[i],employment2011[i],continents[i],countries[i]]);
		coordinates2012.push([income2012[i],employment2012[i],continents[i],countries[i]]);
		coordinates2013.push([income2013[i],employment2013[i],continents[i],countries[i]]);
		coordinates2014.push([income2014[i],employment2014[i],continents[i],countries[i]]);
	};
	
	// settings
	let body = d3.select('body')
	let margin = {top: 50, right: 40, bottom: 40, left: 40};
	let w =	 window.innerWidth - 300;
	let h = window.innerHeight - 300;
	let color = d3.scale.category10();
	
	// create scales (ensuring that dots do not overlap axes)
	let xScale = d3.scale.linear()
		.domain([(d3.min(coordinates2011, function(d)
			{return d[0]; })) - 10000, (d3.max(coordinates2011, function(d)
			{return d[0]; })) + 10000])
		.range([margin.left, (w - margin.right)]);

	let yScale = d3.scale.linear()
		.domain([(d3.max(coordinates2011, function(d)
			{return d[1]; }))+1, (d3.min(coordinates2011, function(d)
			{return d[1]; }))-1])
		.range([margin.top, (h - margin.bottom)]);
	  
	// create axes
	let xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	let yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");
	
	// create svg element
	let svg = body.append("svg")
		.attr("width", w)
		.attr("height", h);
   
	// append axes to svg
	svg.append("g")
		.attr("class", "axis")
		.attr("id", "xAxis")
		.attr("transform", "translate(0," + (h - margin.bottom) + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", w - margin.right)
		.attr("y", -10)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Gross income per capita");
	  
	svg.append("g")
		.attr("class", "axis")
		.attr("id", "yAxis")
		.attr("transform", "translate(" + margin.left + ", 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", -margin.top)
		.attr("y", 5)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Employment rate");
	  
	// create circles
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
		.style("fill", function(d) {return color(d[2]);})
		.on('mouseover', mouseOver)
		.on("mouseout", mouseOut);
		
		
	// create legend
	let legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});

	// legend rectangles
	legend.append("rect")
		.attr("x", w - 18)
		.attr("y", margin.top)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);
	  
	// legend text
	legend.append("text")
		  .attr("x", w - 18)
		  .attr("y", margin.top+10)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { return d; });
		
	// functions to handle mouseover events 
	// help from: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
	function mouseOver(d, i){
		d3.select(this)
			.transition()
			.duration(500)
			.attr('r',10);
		svg.append("text")
			.attr({
				id: "country" + d[3],
				x: function() {return xScale(d[0] - 1000);},
				y: function() {return yScale(d[1] + 3);}
			})
			
			.text(function () {return "Country: " + d[3] + ""})
			
		svg.append("text")

				.attr({
				id: "income" + Math.floor(d[0]),
				x: function() {return xScale(d[0] - 1000);},
				y: function() {return yScale(d[1] + 2);}
			})
			
			.text(function () {return "Income:  " + Math.floor(d[0]) + ""});
			
		svg.append("text")

				.attr({
				id: "employment" + Math.floor(d[1]),
				x: function() {return xScale(d[0] - 1000);},
				y: function() {return yScale(d[1] + 1);}
			})
			
			.text(function () {return "Employment:  " + Math.floor(d[1]) + ""});
		}
	
	function mouseOut(d, i){
		d3.select(this)
			.transition()
			.duration(500)
			.attr('r',5);
		d3.select("#country" + d[3]).remove();
		d3.select("#income" + Math.floor(d[0])).remove();
		d3.select("#employment" + Math.floor(d[1])).remove();
	}	
	
	// on clicking option from dropdown
	document.getElementById("dropdown").onchange=function() {
		
		let year = this.value;
		let coordinates = [];
		
		// choose appropriate data
		if (year === "2011"){
			coordinates = coordinates2011;
		}
		else if (year === "2012"){
			coordinates = coordinates2012;
		}
		else if (year === "2013") {
			coordinates = coordinates2013;
		}
		else if (year === "2014"){
			coordinates = coordinates2014;
		};

		// change x scale and axis
		xScale.domain([(d3.min(coordinates, function(d)
		  {return d[0]; }))-10000, (d3.max(coordinates, function(d)
		  {return d[0]; }))+10000]);
		  
		xAxis.scale(xScale);

		// update x axis
		svg.selectAll("#xAxis")
			// transition not working when switching back from 2014
			//.transition().duration(1000)
			.call(xAxis);

		// move the circles
		d3.selectAll('circle') 
			.transition().duration(1000)
			.attr('cy',function (d) { return yScale(d[1]) })
			.attr('cx',function (d) { return xScale(d[0]) });
			
	}
	}
	
d3.request(data)
	.get(function(xhr) {callback(JSON.parse(xhr.responseText))});
	
	};