/*
 *  Sammy Heutz
 *  10445765
 * 
 * Barchart.js contains the functions that create the barchart via index.js
**/

// create initial bar chart elements
function createBarchart(data, rank){

	// create scales
	yScale = d3.scale.linear()
  	.range([margin.top, (h - margin.bottom)])
  	.domain([d3.max(data, function(d) { return d[rank]; }), 0]);

  	xScale = d3.scale.ordinal()
		.domain(countries)
		.rangeRoundBands([margin.left, w - margin.right], 0.1);

	// create initial elements
	svg
    	.append("text")
    	.attr("id", "title")
    	.attr("x", w / 2 )
    	.attr("y", margin.top / 3)
    	.style("text-anchor", "middle");

	svg
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h - margin.bottom) + ")");

	svg
		.append("g")
		.attr("class","y axis")
		.attr("transform", "translate(" + margin.left + ", 0)")
		.style("font", "10px sans-serif")
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", - margin.top)
		.attr("y", 5)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Rank");
};

// updata bar chart based on data (either europe or per country)
// has to be split up in "if, else" because otherwise transitions won't work
function updateRank(data, rank, title){

	// update values that are same for both charts
	var colour = d3.scale.linear()
    	.range(["green", "red"])
	    .domain([
            d3.min(data, function(d) {return d[rank]; }),
            d3.max(data, function(d) {return d[rank]; })
        ]);

    var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	// bar chart with QOL and HPI for a certain country
	if (rank === "value"){

		var xVal = "category";

		// update xScale
		xScale
		.domain(data.map(function(d) { return d.category; }));

		// setting the x axis	
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");
    
		// create tip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {return "<strong>" + d.category + 
				": </strong> <span style='color:red'>" + d.value + "</span>"; });
		
		svg.call(tip);

		// create bars
		var bars = svg.selectAll("rect")
	   		.data(data);

	   	// remove bars
	   	bars
	   		.exit()
      		.attr("y", yScale(0))
	       	.attr("x", w)
	    	.attr("height", h - yScale(0))
	      	.style('fill-opacity', 1e-6)
	      	.remove();

	    // enter bars
		bars
		   .enter()
		   .append("rect");

		// transition new bars into chart
		bars
			.transition()
			.delay(function(d, i) {
				return 30 * i;
			})
			.duration(1400)
			.attr("x", function(d,i) { return (w - (w -  xScale(d[xVal]))); })
			.attr("y", function(d) {
				return (h - (h - yScale(d[rank])));
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return h - yScale(d[rank]) - margin.bottom;
			})
			.attr('fill', function(d) { 
			  	return colour(d[rank]);
			});

		// show tip
		bars
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);	
	}

	// bar chart with QOL or HPI for europe
	else {

		var xVal = "Country";

		// update x scale
		xScale
			.domain(countries);
	
		// setting the x axis
		xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");
	
		// create tip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				return "<strong>Country:</strong> <span style='color:red'>" + 
				d["Country"] + "</span></br><strong>" + name + 
				"</strong> <span style='color:red'>" + d[rank] + "</span>"; });
	
		svg.call(tip);

		// create bars
		var bars = svg.selectAll("rect")
			.data(data);

		// transition and remove bars
	 	bars.exit()
	    	.transition()
	    	.delay(function(d, i) {
	    		return 30 * i;
	      	})
	      	.duration(1400)
	      	.attr("y", yScale(0))
	      	.attr("x", w)
	      	.attr("height", h - yScale(0))
	      	.style('fill-opacity', 1e-6)
	      	.remove();

	    // enter bars
		bars
		   .enter()
		   .append("rect");

		// transition new bars into chart
		bars
			.transition()
	      	.delay(function(d, i) {
	        	return 30 * i;
	      	})
	      	.duration(1400)
			.attr("x", function(d,i) { return (w - (w -  xScale(d[xVal]))); })
		   	.attr("y", function(d) {
				return (h - (h - yScale(d[rank])));
		   	})
		   	.attr("width", xScale.rangeBand())
		   	.attr("height", function(d) {
				return h - yScale(d[rank]) - margin.bottom;
		 	})
		   	.attr('fill', function(d) { 
	          	return colour(d[rank]);
	        });

		// show tip
		bars
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);	

		// transition and remove bars
		bars
			.exit()
	      	.transition()
	      	.delay(function(d, i) {
	        	return 30 * i;
	      	})
	      	.duration(1400)
			.remove();
	}

	// add axes and title for both types of charts
	svg.select(".x.axis")
		.call(xAxis)
		.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });

    svg.select(".y.axis")
    	.call(yAxis);

    svg.select("#title")
    	.text(title);
};

// create data for bar chart per country
function createBardata(country){
	var countryData = 
		[{
			"category" : "HPI Rank",
			"value" : perCountry[country][0]
		},
		{
			"category" : "QOL Rank",
			"value" : perCountry[country][1]
		}];

	return countryData
};




