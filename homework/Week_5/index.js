/*
 *  Sammy Heutz
 *  10445765
 * 
 * Index.js creates a webpage that displays two visualizations: a map that
 * shows either the HPI rank or the QOL rank for 30 European countries,
 * and a bar chart that shows either the HPI or QOL rank for these countries,
 * or when a country on the map is clicked shows the HPI and QOL rank for this
 * country.
**/

// global variables
var countries = [];
var perCountry = {};
var name;

// bar chart variables
var w = 600,
    h = 350,
    margin = { top: 50, left: 50, bottom: 170, right: 50 },
    barPadding = 3,
    xScale,
    yScale,
    svg;

window.onload = function() {
	
	var qualityOfLife = "quality_of_life.json";
	var happyPlanet = "happy_planet.json";
	
	// retrieve data
	d3.queue()
		.defer(d3.json, happyPlanet)
		.defer(d3.json, qualityOfLife)
		.await(callback);
	
	// create visualizations
	function callback(error, happyPlanet, qualityOfLife) {
	if (error) throw error;
	
		dataLength = happyPlanet.happy_planet.length;

		// variables for easier data usage
		var happy = happyPlanet.happy_planet;
		var quality = qualityOfLife.quality_of_life;

		// change HPI_rank to 1 - 30 for comparison with QOF_Rank
		// create countries array and dict with ranks per country
		for (var i = 0; i < dataLength; i ++){
			happy[i].HPI_Rank = i + 1;
			countries[i] = happy[i].Country;
			perCountry[countries[i]] = [happy[i].HPI_Rank, parseInt(quality[i].QOF_Rank)];
		}

		var seriesHPI = [];
		var seriesQOL = [];

		// create data arrays to colour map based on value
		for (var i = 0; i < dataLength; i ++){
			seriesHPI.push([getCountryCode(countries[i]),happy[i].HPI_Rank]);
			seriesQOL.push([getCountryCode(countries[i]), quality[i].QOF_Rank]);
			};

		// correct format for map colouring
		quality.forEach(function(d) {
			d["QOF_Rank"] = parseInt(d["QOF_Rank"]);
			});
		happy.forEach(function(d) {
			d["HPI_Rank"] = parseInt(d["HPI_Rank"]);
			});

		// initial map and bar settings (HPI)
		name = "Happy Planet Rank: ";
		var rank = "HPI_Rank";
		var title = "Happy Planet Rank Europe";
		var range = ["green", "red"];
		colour = createColour(happy, rank, range);
		var series = seriesHPI;
		var dataset = {};

		// data format to create map colours based on values
		series.forEach(function(item){ 
	    	var iso = item[0],
	       	value = item[1];
	      	dataset[iso] = { numberOfThings: value, fillColor: colour(value) };
	  	});

		// create bar chart elements
		var container = d3.select("#outercontainer").append("div")
	   		.attr("id", "barchart");
		svg = container.append("svg")
		    .attr("width", w)
		    .attr("height", h);

		// create initial barchart and map
		var map = createMap(dataset, name, title);
		var legend = createLegend(happy, "stop-bottom");
		createBarchart(happy, rank);
		updateRank(happy, rank, title, colour);
		
		// change data based on dropdown menu
		// colour blind people can choose different colour range with second dropdown
		function changeRank() {

			var index = this.getAttribute("id");

			// values for Happy Planet Index
			if (index === "HPI" || index === "blindHPI"){
				rank = "HPI_Rank";
				series = seriesHPI;
				name = "Happy Planet Rank: ";
				var dataBar = happy;
				title = "Happy Planet Rank Europe";
				}

			// values for Quality of Life Index
			else {
				rank = "QOF_Rank";
				series = seriesQOL;
				name = "Quality of Life Rank: ";
				var dataBar = quality;
				title = "Quality of Life Rank Europe";
				};

				// determine colour scales: normal or colour blind
				if (index == "blindHPI" || index == "blindQOL"){
					range = ["#fed976", "red"]
					var classy = "stop-bottom-blind"
					colour = createColour(dataBar, rank, range);
				}
				
				else {
					range = ["green", "red"]
					var classy = "stop-bottom"
					colour = createColour(dataBar, rank, range)
				};

			// data format to create map colours based on values
			series.forEach(function(item){
		        var iso = item[0],
		            value = item[1];
		      	dataset[iso] = { numberOfThings: value, fillColor: colour(value) };
		 	 });

			// clear map
			document.getElementById("container").innerHTML = "";
			var mapTitle = document.getElementById("maptitle");
			mapTitle.parentNode.removeChild(mapTitle);
			var mapLegend = document.getElementById("legend");
			mapLegend.parentNode.removeChild(mapLegend);

			// update map and barchart
			map = createMap(dataset, name, title);
			legend = createLegend(happy, classy);
			updateRank(dataBar, rank, title, colour);
};

	document.getElementById("HPI").onclick=changeRank;
	document.getElementById("QOL").onclick=changeRank;
	document.getElementById("blindHPI").onclick=changeRank;
	document.getElementById("blindQOL").onclick=changeRank;
};
};



