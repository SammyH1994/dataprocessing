<!DOCTYPE html>
<html lang="en">
	<head align = "center">

		<meta charset="utf-8">
		<title>D3 Bar graph</title>
		<script type="text/javascript" src="d3/d3.v3.js"></script>
		<h1 align = "center"> US Mass Shootings 1966-2017 </h1>
		<h2 align = "center"> Sammy Heutz, 10445765</h2>
		
	<style>
	
		rect:hover{
			fill: orange;
		}
	
		/* create tooltip for interactivity */
		.d3-tip {
			line-height: 1;
			font-weight: bold;
			padding: 12px;
			background: rgba(0, 0, 0, 0.8);
			color: #fff;
			border-radius: 2px;
		}

		/* create triangle for tooltip */
		.d3-tip:after {
			box-sizing: border-box;
			display: inline;
			font-size: 10px;
			width: 100%;
			line-height: 1;
			color: rgba(0, 0, 0, 0.8);
			content: "\25BC";
			position: absolute;
			text-align: center;
		}
		
		/* style northward tooltips differently */
		.d3-tip.n:after {
		  margin: -1px 0 0 0;
		  top: 100%;
		  left: 0;
}	
	</style>
	</head>

	<body align = "center">
	
		<script src="https://d3js.org/d3.v3.js"></script>
		<script src="https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
		<script type="text/javascript">
		
	window.onload = function() {	
	
	let quality_of_life = "/quality_of_life.json"
	let happy_planet = "/happy_planet.json"
	
	d3.queue()
	.defer(d3.json, happy_planet)
	.defer(d3.json, quality_of_life)
	.await(callback);

	
	function callback(error, happy_planet, quality_of_life) {
	if (error) throw error;
	
	dataLength = happy_planet.happy_planet.length

			console.log(data.mass_shootings.Date)
				// parse Amount so that d3.max works
				data.mass_shootings.forEach(function(d) {
					d.Date = d.Date;
					d.Amount = parseInt(d.Amount);
				});

				// setting the dimensions of the graph
				var margin = {top: 40, right: 40, bottom: 0, left: 40};
				var w =	 window.innerWidth - 200
				var h = window.innerHeight	- 200
				var barPadding = 1;
				
				// setting the scales
				var xScale = d3.scale.ordinal()
					.rangeRoundBands([margin.left, w + margin.right])
				var yScale = d3.scale.linear()
					.range([margin.top, (h - margin.bottom)])
					.domain([d3.max(data.mass_shootings, function(d) { return d.Amount; }), 0]);
					
				// setting the axes	
				var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
				var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")

				// creating the svg element
				var svg = d3.select("body")
					.append("svg")
					.attr("width", w + margin.left + margin.right)	 
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("tranform", "translate(" + margin.left + "," + margin.top + ")");
					
				// creating the tooltip			
				var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d) {
					return "<strong>Year:</strong> <span style='color:red'>" + d.Date + 
					"</span></br><strong>Amount:</strong> <span style='color:red'>" + d.Amount + "</span>";
				  })
				svg.call(tip);

				// creating the barchart
				svg.selectAll("rect")
				   .data(data.mass_shootings)
				   .enter()
				   .append("rect")
				   .attr("x", function(d, i) {
						return i * (w / data.mass_shootings.length) + margin.left;
				   })

				   .attr("y", function(d) {
						return (h - (h - yScale(d.Amount)));
				   })
				   .attr("width", w / data.mass_shootings.length - barPadding)
				   .attr("height", function(d) {
						return h - yScale(d.Amount) - margin.bottom;
				   })
				   .attr("fill", function(d) {
						return "rgb(" + (d.Amount * 20) + ", 0, 0)"
						})
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);
		  
				// creating the axes
				svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + (h - margin.bottom) + ")")
					.call(xAxis);		
				svg.append("g")
					.attr("class","axis")
					.attr("transform", "translate(" + margin.left + ", 0)")
					.call(yAxis);		
				});		
		
		</script>
	</body>
</html>		