/*
	Sammy Heutz, 10445765
*/


// global variables
var svg;
var tip;
var xScale;
var yScale;
var countries = []
var happy;
var quality;
var perCountry = {}
var name;

window.onload = function() {	
	
	let quality_of_life = "/quality_of_life.json"
	let happy_planet = "/happy_planet.json"
	
	// retrieve data
	d3.queue()
	.defer(d3.json, happy_planet)
	.defer(d3.json, quality_of_life)
	.await(callback);
	
	function callback(error, happy_planet, quality_of_life) {
	if (error) throw error;
	
		dataLength = happy_planet.happy_planet.length

		// change HPI_rank to 1-30 for comparison with QOF-Rank
		for (let i = 0; i <dataLength; i++){
			happy_planet.happy_planet[i].HPI_Rank = i+1
		}

		// variables for easier data usage
		happy = happy_planet.happy_planet
		quality = quality_of_life.quality_of_life

		// countries array and dict with ranks per country
		for (let i = 0; i < dataLength; i++){
			countries[i] = happy[i].Country
			perCountry[countries[i]] = [happy[i].HPI_Rank, parseInt(quality[i].QOF_Rank)]
		};

		var seriesHPI = [];
		var seriesQOL = [];

		// data arrays to colour map based on value
		for (var i = 0; i < dataLength; i++){
			//HPI
			seriesHPI.push([getCountryCode(countries[i]),happy[i].HPI_Rank])
			
			//QOL
			seriesQOL.push([getCountryCode(countries[i]), quality[i].QOF_Rank])
			};

		// correct format for map colouring
		quality.forEach(function(d) {
			d["QOF_Rank"] = parseInt(d["QOF_Rank"])
			});
		happy.forEach(function(d) {
			d["HPI_Rank"] = parseInt(d["HPI_Rank"])
			});


		// initial map and bar settings (HPI)
		name = "Happy Planet Rank: "
		var rank = "HPI_Rank"
		var title = "Happy Planet Rank Europe"
		var colour = createColour(happy, rank)
		series = seriesHPI

		var dataset = {}

		series.forEach(function(item){ 
	       var iso = item[0],
	           value = item[1];
	      dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
	  });

		// create initial map
		var map = createMap(dataset, name, title)
		legend = createLegend(happy)


		// bar chart elements
		var container = d3.select("#outercontainer").append("div")
	    	.attr("id", "barchart")
		svg = container.append("svg")
		      .attr("width", w)
		      .attr("height", h)

		// create initial barchart
		createBarchart(happy, rank)
		updateRank(happy, rank, title)
		

		// change data based on dropdown
		function changeRank() {


			let index = this.getAttribute('id');
			
			// values for Happy Planet
			if (index === "HPI"){
				rank = "HPI_Rank"
				colour = createColour(happy, rank);
				series = seriesHPI
				name = "Happy Planet Rank: "
				var dataBar = happy
				title = "Happy Planet Rank Europe"
				}

			// values for Quality of Life
			else {
				rank = "QOF_Rank"
				colour = createColour(quality, rank);
				series = seriesQOL
				name = "Quality of Life Rank: "
				var dataBar = quality
				title = "Quality of Life Rank Europe"
				};

			// data for colouring map
			series.forEach(function(item){ 
		        var iso = item[0],
		            value = item[1];
		      	dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
		 	 });

			// new map

			document.getElementById("container").innerHTML = "";
			x = document.getElementById("maptitle");
			x.parentNode.removeChild(x)

			map = createMap(dataset, name, title)

			// new barchart
			updateRank(dataBar, rank, title)

};

	document.getElementById("HPI").onclick=changeRank	
	document.getElementById("QOL").onclick=changeRank

}
}



