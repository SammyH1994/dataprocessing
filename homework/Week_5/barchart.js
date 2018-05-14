var w = 800,
    h = 450,
    margin = { top: 50, left: 50, bottom: 170, right: 50 },
    barPadding = 3;

var colour = d3.scale.linear()
    .range(["green", "red"])

function setTip(indx, rank){

				// creating the tooltip			
				tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d) {
					return "<strong>Country:</strong> <span style='color:red'>" + d["Country"] + 
					"</span></br><strong>"+indx+"</strong> <span style='color:red'>" + d[rank] + "</span>";
				  })

				  	return tip
}

function createBarchart(data, rank){

		yScale = d3.scale.linear()
      	.range([margin.top, (h - margin.bottom)])
      	.domain([d3.max(data, function(d) { return d[rank]; }), 0]);

      		xScale = d3.scale.ordinal()
  			.domain(countries)
    		.rangeRoundBands([margin.left, w-margin.right], 0.1);

	svg
    	.append("text")
    	.attr("id", "title")
    	.attr("x", w / 2 )
    	.attr("y", margin.top)
    	.style("text-anchor", "middle")

	svg
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h - margin.bottom) + ")");

	svg
		.append("g")
		.attr("class","y axis")
		.attr("transform", "translate(" + margin.left + ", 0)");
};

function updateRank(data, rank, title)
{

	// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")

	colour
	    .domain([
            d3.min(data, function(d) {return d[rank];}),
            d3.max(data, function(d) {return d[rank]; })
        ])

		tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<strong>Country:</strong> <span style='color:red'>" + d["Country"] + 
		"</span></br><strong>"+name+"</strong> <span style='color:red'>" + d[rank] + "</span>";
				  })
	svg.call(tip);

	var bars = svg.selectAll("rect")
	   .data(data);

	bars
	   .enter()
	   .append("rect");

	bars
	 .transition()
	.duration(300)
		.attr("x", function(d,i) { return (w -(w-  xScale(countries[i] ))); })
	   .attr("y", function(d) {
			return (h - (h - yScale(d[rank])));
	   })
	   .attr("width", xScale.rangeBand())
	   .attr("height", function(d) {
			return h - yScale(d[rank]) - margin.bottom;
	   })
	   .attr('fill', function(d) { 
          return colour(d[rank]);
        })

	bars
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);	

		bars
		.exit()
		.transition()
    	.duration(300)
		.remove();

	svg.select(".x.axis")
		.transition()
		.duration(300)
		.call(xAxis)
		.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

    svg.select(".y.axis")
    	.transition()
    	.duration(300)
    	.call(yAxis)

    svg.select("#title")
    	.transition()
    	.duration(300)
    	.text(title);
}



function updateCountry(data, title)
{

	xScale
	.domain(data.map(function(d) { return d.category; }))

		// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")

	colour
	    .domain([
            d3.min(data, function(d) {return d.value;}),
            d3.max(data, function(d) {return d.value; })
        ])
		tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<strong>" + d.category + ": </strong> <span style='color:red'>" + d.value + 
		"</span>";
				  })
	svg.call(tip);

	var bars = svg.selectAll("rect")
	   .data(data);

	bars
	   .enter()
	   .append("rect");

	bars
		.transition()
		.duration(300)
		.attr("x", function(d,i) { return (w -(w- xScale(d.category ))); })
	   .attr("y", function(d) {
			return (h - (h - yScale(d.value)));
	   })
	   .attr("width", xScale.rangeBand())
	   .attr("height", function(d) {
			return h - yScale(d.value) - margin.bottom;
	   })
	   .attr('fill', function(d) { 
          return colour(d.value);
        })

	bars
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);	

		bars
		.exit()

		.remove();

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
    	.transition()
    	.duration(300)
    	.call(yAxis)

    svg.select("#title")
    	.transition()
    	.duration(300)
    	.text(title);
}



function createBardata(country){
	var countryData = 
		[
		{
			"category" : "HPI Rank",
			"value" : perCountry[country][0]
		},
		{
			"category" : "QOL Rank",
			"value" : perCountry[country][1]
		}
]
	return countryData
}




