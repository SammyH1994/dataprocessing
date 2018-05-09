

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
	console.log(quality_of_life)
	var series = []
console.log()
	for (var i = 0; i < dataLength; i++){
		//HPI
		series.push([getCountryCode(happy_planet.happy_planet[i].Country),happy_planet.happy_planet[i].Happy_Planet_Index])
		
		//QOL
		//series.push([getCountryCode(quality_of_life.quality_of_life[i].Country), quality_of_life.quality_of_life[i].QOF_Rank])
	}

	console.log(series)


	 var dataset = {};

	 //QOL
	//  var colour = d3.scale.linear()
	// 	.domain([
 //    d3.min(quality_of_life.quality_of_life, function(d) { return d.QOF_Rank; }),
 //    d3.max(quality_of_life.quality_of_life, function(d) { return d.QOF_Rank; })
	// ])
 //  .range(["red", "green"]);

// HPI
	var colour = d3.scale.linear()
	.domain([
    d3.min(happy_planet.happy_planet, function(d) { return d.Happy_Planet_Index; }),
    d3.max(happy_planet.happy_planet, function(d) { return d.Happy_Planet_Index; })
	])
  .range(["red", "green"]);

     // fill dataset in appropriate format
    series.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
                value = item[1];
        dataset[iso] = { numberOfThings: value, fillColor: colour(value) };
    });

new Datamap({
        element: document.getElementById('container'),
        //projection: 'mercator', // big world map
        setProjection: function (element) {
            var projection = d3.geo.mercator()
                    .center([30.864716, 55.349014]) // always in [East Latitude, North Longitude]
                    .scale(380);
                var path = d3.geo.path().projection(projection);
                return { path: path, projection: projection };
            },
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
        	//dataUrl: '/europe.json'
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Happy Planet Index: <strong>', Math.round(data.numberOfThings), '</strong>',
                    '</div>'].join('');
            }
          }
      });
  

};

}




