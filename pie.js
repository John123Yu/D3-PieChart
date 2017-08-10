var dataArray = [[65.85, "Chrome"],[10.45, "Safari"],[10.17, "Internet Explorer"],[8.78, "Firefox"],[3.47, "Edge"], [1.28, "Other"]]

var pieChart = function(dataArray, chart) {

	dataArray.forEach(function(d) {
	    d[2] = true;                        
	});

	var width = 720;
	var height = 360;
	var radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var svg = d3.select(chart)
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height)
	  .append('g')
	  .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

	var arc = d3.arc()
	  .innerRadius(0)
	  .outerRadius(radius);

	var pie = d3.pie()
	  .value(function(d) { return d[0]; })
	  .sort(null);

	var path = svg.selectAll('path')
	  .data(pie(dataArray))
	  .enter()
	  .append('path')
	  .attr('d', arc)
	  .attr('fill', function(d, i) {
	    return color(d.data[1]);
	  })
	  .each(function(d) { this._current = d; });

	path.on('mouseover', function(d) {
	  var total = d3.sum(dataArray.map(function(d) {
	    return (d[2]) ? d[0] : 0;
	  }));
	  var percent = d.data[0];
	  tooltip.select('.label').html(d.data[1]);
	  tooltip.select('.percent').html(percent + '%');
	  tooltip.style('display', 'block');
	});

	path.on('mouseout', function() {
	  tooltip.style('display', 'none');
	});

	path.on('mousemove', function(d) {
	  tooltip.style('top', (d3.event.layerY + 10) + 'px')
	    .style('left', (d3.event.layerX + 10) + 'px');
	});

	var legendRectSize = 18;
	var legendSpacing = 4;

	var legend = svg.selectAll('.legend')
	  .data(color.domain())
	  .enter()
	  .append('g')
	  .attr('class', 'legend')
	  .attr('transform', function(d, i) {
	    var height = legendRectSize + legendSpacing;
	    var offset =  height * color.domain().length / 2;
	    var horz = 220
	    var vert = i * height - offset;
	    return 'translate(' + horz + ',' + vert + ')';
	  });

	legend.append('rect')
	  .attr('width', legendRectSize)
	  .attr('height', legendRectSize)
	  .style('fill', color)
	  .style('stroke', color)
	  .on('click', function(label) {
		  var rect = d3.select(this);
		  var enabled = true;
		  var totalEnabled = d3.sum(dataArray.map(function(d) {
		    return (d[2]) ? 1 : 0;
		  }));

		  if (rect.attr('class') === 'disabled') {
		    rect.attr('class', '');
		  } else {
		    if (totalEnabled < 2) return;
		    rect.attr('class', 'disabled');
		    enabled = false;
		  }

		  pie.value(function(d) {
		    if (d[1] === label) d[2] = enabled;
		    return (d[2]) ? d[0] : 0;
		  });

		  path = path.data(pie(dataArray));

		  path.transition()
		    .duration(750)
		    .attrTween('d', function(d) {
		      var interpolate = d3.interpolate(this._current, d);
		      this._current = interpolate(0);
		      return function(t) {
		        return arc(interpolate(t));
		      };
		    });
	  });

	legend.append('text')
	  .attr('x', legendRectSize + legendSpacing)
	  .attr('y', legendRectSize - legendSpacing)
	  .text(function(d) { return d; });

	var tooltip = d3.select(chart)         
	  .append('div')                            
	  .attr('class', 'pie-chart-tooltip');               

	tooltip.append('div')                        
	  .attr('class', 'label');                  
	tooltip.append('div')                        
	  .attr('class', 'percent');
	
}

pieChart(dataArray, '#chart');

