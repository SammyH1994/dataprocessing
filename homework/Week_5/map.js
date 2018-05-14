function createColour(data, values){
    return d3.scale.linear()
        .domain([
            d3.min(data, function(d) {return d[values];}),
            d3.max(data, function(d) {return d[values]; })
        ])
        .range(["green", "red"])
}


function createMap(dataset, string){
   var map = new Datamap({
            element: document.getElementById('container'),
            done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data) {

                currentCountry = geography.properties.name;
                if (!countries.includes(currentCountry)){return}
                data = createBardata(currentCountry)
                updateCountry(data, currentCountry)

            });
        },
            setProjection: function (element) {
                var projection = d3.geo.mercator()
                        .center([30.864716, 55.349014]) // always in [East Latitude, North Longitude]
                        .scale(380);
                    var path = d3.geo.path().projection(projection);
                    return { path: path, projection: projection };
                },
            // countries not listed in dataset will be painted with this color
            fills: { defaultFill: '#F5F5F5' },
            data: dataset,
            geographyConfig: {
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
          });
map.legend();

}
