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


// global variables
var svg; 
var xScale;
var yScale;
var happy;
var quality;
var rank;
var name;
var countries = []
var title;

var rankHPI = "HPI_Rank"
var rankQOL = "QOF_Rank"
var qualityname = "Quality of Life Rank: "
var happyTitle = "Happy Planet Rank Europe"
var qualityTitle = "Quality of Life Rank Europe"
var tip;

window.onload = function() {	
	
	var currentCountry;
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

		// variables for creating visualizations
		var dataset = {}
		happy = happy_planet.happy_planet
		quality = quality_of_life.quality_of_life


		var seriesHPI = []
		var seriesQOL = []

		rank = "HPI_Rank";
		var perCountry = {}

		for (let i = 0; i < dataLength; i++){
			perCountry[happy[i].Country] = [happy[i].HPI_Rank, parseInt(quality[i].QOF_Rank)]
		}


		// data arrays to colour map based on value
		for (var i = 0; i < dataLength; i++){
			//HPI
			seriesHPI.push([getCountryCode(happy[i].Country),happy[i].HPI_Rank])
			
			//QOL
			seriesQOL.push([getCountryCode(quality[i].Country), quality[i].QOF_Rank])
		}


		// correct format for map colouring
		quality.forEach(function(d) {
			d["QOF_Rank"] = parseInt(d[rankQOL])
					});
		happy.forEach(function(d) {
			d[rankHPI] = parseInt(d[rankHPI])
					});

		console.log(quality)
		// initial map settings (HPI)
		var colour = createColour(happy, rank)
		series = seriesHPI

		series.forEach(function(item){ 
	       var iso = item[0],
	           value = item[1];
	      dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
	  });


	// country arrays for x scale
	for (let i = 0; i < dataLength; i++){

		countries[i] = happy[i].Country
	}

	// set initial bar chart values
	var container = d3.select("body").append("div")
	    .attr("id", "barchart")

	svg = container.append("svg")
	      .attr("width", w)
	      .attr("height", h)

	name = "Happy Planet Rank: "

	// create initial map
	var map = createMap(dataset, name)

	// creating initial barchart
	createBarchart(happy, rank, happyTitle)
			
	// change data based on dropdown
	document.getElementById("dropdown").onchange=function() {

		let index = this.value;
		
		// values for Happy Planet
		if (index === "HPI"){
			rank = "HPI_Rank"
			name = "Happy Planet Rank: "
			colour = createColour(happy, rank);

			series = seriesHPI
			//tip = setTip(happyname, rank)
			var dataBar = happy
			title = happyTitle
			}

		// values for Quality of Life
		else {
			rank = "QOL_Rank"
			name = "Quality of Life Rank: "
			colour = createColour(quality, rank);
			series = seriesQOL

			//tip = setTip(qualityname, rank)
			var dataBar = quality
			title = qualityTitle
			};

		// data for colouring map
		series.forEach(function(item){ 
	        var iso = item[0],
	            value = item[1];
	      	dataset[iso] = { numberOfThings: value, fillColor: colour(value) }
	 	 });

		// change scales
		//xScale = setxScale(dataBar, rank, countries)
	   // yScale = setyScale(dataBar, indx, countries)

		// new map
		document.getElementById("container").innerHTML = "";
		map = createMap(dataset, name)

		// new barchart
		createBarchart(dataBar, rank, title)

};

document.getElementById("container").addEventListener("click", function(){
});

}
}



