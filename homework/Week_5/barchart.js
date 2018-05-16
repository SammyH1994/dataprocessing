var w = 600,
    h = 350,
    margin = { top: 50, left: 50, bottom: 170, right: 50 },
    barPadding = 3;

var colour = d3.scale.linear()
    .range(["green", "red"])

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
    	.attr("y", margin.top/3)
    	.style("text-anchor", "middle")

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

function updateRank(data, rank, title)

{
	if (rank === "value"){
		var xVal = "category"
		xScale
		.domain(data.map(function(d) { return d.category; }))

		 var tipString =  function(d) {
		return "<strong>" + d.category + ": </strong> <span style='color:red'>" + d.value + 
		"</span>";}


	// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")


	colour
	    .domain([
            d3.min(data, function(d) {return d[rank]}),
            d3.max(data, function(d) {return d[rank]; })
        ])
    

		tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(tipString)
	svg.call(tip);

	var bars = svg.selectAll("rect")
	   .data(data);

	   bars
	   .exit()
      .attr("y", yScale(0))
      .attr("x", w)
      .attr("height", h - yScale(0))
      .style('fill-opacity', 1e-6)
      .remove();

	bars
	   .enter()
	   .append("rect");


	bars
    .transition()
      .delay(function(d, i) {
        return 30 * i;
      })
      .duration(1400)
		.attr("x", function(d,i) { return (w -(w-  xScale(d[xVal] ))); })
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

    	.call(yAxis)
    svg.select("#title")
    	.text(title);


	}
	else {
		var xVal = "Country"
		xScale
		.domain(countries)

		var tipString = function(d) {
		return "<strong>Country:</strong> <span style='color:red'>" + d["Country"] + 
	 	"</span></br><strong>"+name+"</strong> <span style='color:red'>" + d[rank] + "</span>";}
	

	
	// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")

	colour
	    .domain([
            d3.min(data, function(d) {return d[rank]}),
            d3.max(data, function(d) {return d[rank]; })
        ])
    

		tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(tipString)
	svg.call(tip);

	var bars = svg.selectAll("rect")
	   .data(data);

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

	bars
	   .enter()
	   .append("rect");


	bars
	      .transition()
      .delay(function(d, i) {
        return 30 * i;
      })
      .duration(1400)
		.attr("x", function(d,i) { return (w -(w-  xScale(d[xVal] ))); })
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
      .delay(function(d, i) {
        return 30 * i;
      })
      .duration(1400)
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

    	.call(yAxis)
    svg.select("#title")
    	.text(title);
}
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




