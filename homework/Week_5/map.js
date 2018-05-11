function createColour(data, values, range){
    return d3.scale.linear()
        .domain([
            d3.min(data, function(d) {return d[values];}),
            d3.max(data, function(d) {return d[values]; })
        ])
        .range(range)
}

function createMap(dataset, string){
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
                        '<br>' +string+ ' <strong>', Math.round(data.numberOfThings), '</strong>',
                        '</div>'].join('');
                }
              }
          });}
