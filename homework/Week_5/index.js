/*
	Sammy Heutz, 10445765
*/


/* comments:
Next week:
Add linking --> when hovering over map: bar of country also lights up and vice versa
or other linking?????
Try to make colours more gradual?
Add other variables?
Bootstrapping styles etc
Improve code
Add data information + design choices
*/

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

		// variables for creating visualizations
		var dataset = {}
		var happy = happy_planet.happy_planet
		var indexHPI = "HPI_Rank"
		var rangeHPI = ["red", "green"]
		var happyname = "Happy Planet Rank: "
		var quality = quality_of_life.quality_of_life
		var rankQOL = "QOF_Rank"
		var rangeQOL = ["green", "red"]
		var qualityname = "Quality of Life Rank: "
		var happy_index = "Happy_Planet_Index"
		var happy_name = "Happy Planet Index: "
		var quality_index = "Quality_of_Life_Index"
		var quality_name = "Quality of Life Index: "
		var happyTitle = "Happy Planet Index Europe"
		var qualityTitle = "Quality of Life Index Europe"

		var seriesHPI = []
		var seriesQOL = []

		// data arrays to colour map based on value
		for (var i = 0; i < dataLength; i++){
			//HPI
			seriesHPI.push([getCountryCode(happy_planet.happy_planet[i].Country),happy_planet.happy_planet[i].HPI_Rank])
			
			//QOL
			seriesQOL.push([getCountryCode(quality_of_life.quality_of_life[i].Country), quality_of_life.quality_of_life[i].QOF_Rank])
		}

		// correct format for map colouring
		quality.forEach(function(d) {
			d[quality_index] = parseInt(d[quality_index])
					});
		happy.forEach(function(d) {
			d[happy_index] = parseInt(d[happy_index])
					});

		// initial map settings (HPI)
		var colour = createColour(happy,indexHPI,rangeHPI)
		series = seriesHPI

		series.forEach(function(item){ 
	       var iso = item[0],
	           value = item[1];
	      dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
	  });

	var countriesHappy = []
	var countriesQuality = []

	// country arrays for x scale
	for (let i = 0; i < dataLength; i++){

		countriesHappy[i] = happy[i].Country
		countriesQuality[i] = quality[i].Country
	}

	// set initial bar chart values
	var container = d3.select("body").append("div")
	    .attr("id", "barchart")
	var xScale = setxScale(happy, happy_index, countriesHappy)
	var yScale = setyScale(happy, happy_index, countriesHappy)
	var tip = setTip(happy_name, happy_index)

	// create initial map
	var map = createMap(dataset, happyname )

	// creating initial barchart
	createBarchart(container, tip, happy, countriesHappy, yScale, xScale, happy_index, happyTitle)
			
	// change data based on dropdown
	document.getElementById("dropdown").onchange=function() {

		let index = this.value;
		
		// values for Happy Planet
		if (index === "HPI"){
			colour = createColour(happy, indexHPI, rangeHPI);
			series = seriesHPI
			var name = happyname
			tip = setTip(happy_name, happy_index)
			var dataBar = happy
			var countries = countriesHappy
			var indx = happy_index
			var title = happyTitle
			}

		// values for Quality of Life
		else {
			colour = createColour(quality, rankQOL, rangeQOL);
			series = seriesQOL
			var name = qualityname

			tip = setTip(quality_name, quality_index)
			var dataBar = quality
			var countries = countriesQuality
			var indx = quality_index
			var title = qualityTitle
			};

		// data for colouring map
		series.forEach(function(item){ 
	        var iso = item[0],
	            value = item[1];
	      	dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
	 	 });

		// change scales
		xScale = setxScale(dataBar, indx, countries)
	    yScale = setyScale(dataBar, indx, countries)

		// new map
		document.getElementById("container").innerHTML = "";
		createMap(dataset, name)

		// new barchart
		// next week: maybe transitions instead of entirely new chart?
		document.getElementById("barchart").innerHTML = "";
		createBarchart(container, tip, dataBar, countries, yScale, xScale, indx, title)

};

}
}



