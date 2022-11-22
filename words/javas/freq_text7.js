function main() {
	var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

		svg.append("text")
		.attr("transform", "translate(100,0)")
		.attr("x", 100)
		.attr("y", 50)
		.style("font-size", "24px")
		.text("Frequency of clinical words in a class")

    var xScale = d3.scaleBand().range([0, width]).paddingInner(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("csv/Classtext7.csv").then( function(data) {
        xScale.domain(data.map(function(d) { return d.Word; }));
        yScale.domain([0, d3.max(data, function(d) { return d.frequency*1; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale).ticks(d3.timeDay.every(4)))
         .selectAll("text")  
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform","rotate(-65)")
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Word");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){return d;}).ticks(12))
	 .append("text")
	 .attr("transform", "rotate(-90)")
	 .attr("y", 10)
	 .attr('dy', '-5em')
	 .attr('text-anchor', 'end')
	 .attr('stroke', 'black')
	 .text('Word Count')

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
	 .on("mouseover", onMouseOver) // Add listener for event
	 .on("mouseout", onMouseOut)
         .attr("x", function(d) { return xScale(d.Word); })
         .attr("y", function(d) { return yScale(d.frequency); })
         .attr("width", xScale.bandwidth())
	 .transition()
	 .ease(d3.easeLinear)
	 .duration(500)
	 .delay(function(d,i){ return i * 50})
         .attr("height", function(d) { return height - yScale(d.frequency); });
	})
       
	// // Mouseover event handler

	function onMouseOver(d, i) {
		// Get bar's xy values, ,then augment for the tooltip
		var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
		var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2

		// Update Tooltip's position and value
		d3.select('#tooltip')
			.style('left', xPos + 'px')
			.style('top', yPos + 'px')
            .select('#name').text(i.Word+" "+i.frequency)
		
		d3.select('#tooltip').classed('hidden', false);

		d3.select(this).attr('class','highlight')
		d3.select(this)
			.transition() 
			.duration(500)
			.attr('width', xScale.bandwidth() + 5)
			.attr('y', function(d){return yScale(d.frequency) - 10;})
			.attr('height', function(d){return height - yScale(d.frequency) + 10;})

	}

	// // Mouseout event handler
	function onMouseOut(d, i){
		d3.select(this).attr('class','bar')
		d3.select(this)
			.transition()
			.duration(500)
			.attr('width', xScale.bandwidth())
			.attr('y', function(d){return yScale(d.frequency);})
			.attr('height', function(d) {return height - yScale(d.frequency)})
		
		d3.select('#tooltip').classed('hidden', true);
	}
}