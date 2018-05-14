var w = 800,
    h = 450,
    margin = { top: 50, left: 50, bottom: 170, right: 50 },
    barPadding = 3;

function setxScale(dataset, values)
{

  var xScale = d3.scale.ordinal()
  	.domain(countries)
    .rangeRoundBands([margin.left, w-margin.right], 0.1);

 return xScale
}

function setyScale(dataset, values){

	  var yScale = d3.scale.linear()
		.domain([d3.max(dataset, function(d) { return d[values]; }), 0])
      	.range([margin.top, (h - margin.bottom)]);

      	return yScale
}

function setTip(indx, rank){

				// creating the tooltip			
				var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d) {
					return "<strong>Country:</strong> <span style='color:red'>" + d["Country"] + 
					"</span></br><strong>"+indx+"</strong> <span style='color:red'>" + d[rank] + "</span>";
				  })

				  	return tip
}

function createBarchart(data, rank, title){

	xScale = setxScale(data, rank)
	yScale = setyScale(data, rank)

	// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")

	tip = setTip(name, rank)
	svg.call(tip);

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
	   .attr("fill", function(d) {
			return "rgb(" + (d[rank] * 20) + ", 0, 0)"
			});

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

function updateRank()
{


}

function updateCountry()
{
	
}


function createBardata(country){
	var countryData = {
		country : [
		{
			"HPI_Rank" : perCountry[country][0],
			"QOL_Rank" : perCountry[country][1]
		}]
	}
	return countryData
}
