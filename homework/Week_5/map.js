function createColour(data, values){
    return d3.scale.linear()
        .domain([
            d3.min(data, function(d) {return d[values];}),
            d3.max(data, function(d) {return d[values]; })
        ])
        .range(["green", "red"])
}


function createMap(dataset, string, titel){


            maptitle = d3.select("#outercontainer")
            .append("text")
            .attr("width", 600)
            .attr("height", 20)
        .append("text")
        .attr("id", "maptitle")
        .text(titel);


   var map = new Datamap({

            element: document.getElementById('container'),
            done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data) {

                currentCountry = geography.properties.name;
                if (!countries.includes(currentCountry)){return}
                data = createBardata(currentCountry)
                updateRank(data, "value", currentCountry)

            });
        },
            setProjection: function (element) {
                var projection = d3.geo.mercator()
                        .center([41.864716, 49.349014]) // always in [East Latitude, North Longitude]
                        .scale(300);
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
                highlightBorderColor: 'orange',
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
};

function createLegend(data){
        
        // help from http://bl.ocks.org/pnavarrc/20950640812489f13246

        var w = 70, h = 300;

        var key = d3.select("#outercontainer")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend");

            // Create the svg:defs element and the main gradient definition.
            var svgDefs = key.append('defs');

            var mainGradient = svgDefs.append('linearGradient')
                .attr('id', 'mainGradient')
                            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

            // Create the stops of the main gradient. Each stop will be assigned
            // a class to style the stop using CSS.
            mainGradient.append('stop')
                .attr('class', 'stop-top')
                .attr('offset', "0%");

            mainGradient.append('stop')
                .attr('class', 'stop-bottom')
                .attr('offset', "100%");

            // Use the gradient to set the shape fill, via CSS.
            key.append('rect')
                .classed('filled', true)
                .attr('width', (w/2))
                .attr('height', h);


        var y = d3.scale.linear()
            .range([h, 0])
            .domain([
            d3.min(data, function(d) {return d.HPI_Rank;}),
            d3.max(data, function(d) {return d.HPI_Rank; })
        ]);


var yAxis = d3.svg.axis()
            .scale(y)
            .orient("right");

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(41,10)")
            .style("font", "10px sans-serif")
            .call(yAxis);

      

}

