var w = 800,
    h = 450,
    margin = { top: 50, left: 50, bottom: 170, right: 50 },
    barPadding = 3;

function setxScale(dataset, values, countries)
{

  var xScale = d3.scale.ordinal()
  	.domain(countries)
    .rangeRoundBands([margin.left, w-margin.right], 0.1);

 return xScale
}

function setyScale(dataset, values, countries){

	  var yScale = d3.scale.linear()
		.domain([d3.max(dataset, function(d) { return d[values]; }), 0])
      	.range([margin.top, (h - margin.bottom)]);

      	return yScale
}

function setTip(indx, indxstring){

				// creating the tooltip			
				var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d) {
					return "<strong>Country:</strong> <span style='color:red'>" + d["Country"] + 
					"</span></br><strong>"+indx+"</strong> <span style='color:red'>" + d[indxstring] + "</span>";
				  })

				  	return tip
}

function createBarchart(container, tip, data, countries, yScale, xScale, indxstring, title){

	var svg = container.append("svg")
              .attr("width", w)
              .attr("height", h)

		// setting the axes	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
	
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")

	svg.call(tip);


	svg.selectAll("rect")
				   .data(data)
				   .enter()
				   .append("rect")
					.attr("x", function(d,i) { return (w -(w-  xScale(countries[i] ))); })
				   .attr("y", function(d) {
						return (h - (h - yScale(d[indxstring])));
				   })
				   .attr("width", xScale.rangeBand())
				   .attr("height", function(d) {
						return h - yScale(d[indxstring]) - margin.bottom;
				   })
				   .attr("fill", function(d) {
						return "rgb(" + (d[indxstring] * 20) + ", 0, 0)"
						})
				   	.on('mouseover', tip.show)
					.on('mouseout', tip.hide);	

    	svg.append("text")
    	.attr("x", w / 2 )
    	.attr("y", margin.top)
    	.style("text-anchor", "middle")
    	.text(title);

					svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + (h - margin.bottom) + ")")
					.call(xAxis)
					        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });


				svg.append("g")
					.attr("class","axis")
					.attr("transform", "translate(" + margin.left + ", 0)")
					.call(yAxis);


}
