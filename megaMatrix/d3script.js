d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};
var dataset, colNames, rowNames, svg, zoom, xAxis, yAxis, x, y;
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = window.innerWidth * 0.95 - margin.left - margin.right;
var height = window.innerHeight * 0.95- margin.top - margin.bottom;
var cellPadding = 1;
zoom = d3.behavior.zoom()
.scaleExtent([1, 100])
.on("zoom", zoom);

d3.json("outputJSON/output.json", function(matrix) {
	dataset=[];
	colNames = matrix.meta.fields;
	colNames.shift();
	rowNames = [];
	for (var i = 0; i < (matrix.data).length; i++) {
		rowNames.push(matrix.data[i]['moduleNameInMatrices']);
		dataset[i] = [];
		for (var j = 0; j < colNames.length; j++) {
			dataset[i][j] = matrix.data[i][colNames[j]];
		};
	};

	x = d3.scale.ordinal()
	.domain(colNames)
	.rangePoints([0, width], 1);

	y = d3.scale.ordinal()
	.domain(rowNames)
	.rangePoints([0, height], 1);

	xAxis = d3.svg.axis()
	.scale(x)
	.orient("top");

	yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.call(zoom)
	.append("g");

	var rect = svg.selectAll("rect");
	var text = svg.selectAll("text");

	for (var j = 0; j < dataset.length; j++) {
		rect.data(dataset[j])
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			return i * (width / dataset[j].length);
		})
		.attr("y", j * (height / dataset.length))
		.attr("width", width / dataset[j].length - cellPadding)
		.attr("height", height / dataset.length - cellPadding)
		.style("fill", function(d) {
			return getColorD3(d);
		})
		.on('mouseover', function(d,i) {
			d3.select(this).style({"stroke":"red","stroke-width":1});
			//d3.select(this).moveToFront();
			d3.select("text").text(j + " -- " + colNames[i] + " -- " + d);
		})
		.on('mouseout', function(d,i) {
			d3.select(this).style({"stroke-width":0});
			d3.select("text").text("");
		});

		text.data(dataset[j])
		.enter()
		.append("text")
		.attr("x", function(d, i) {
			return i * (width / dataset[j].length);
		})
		.attr("y", j * (height / dataset.length))
		.style("font-size", 1)
		.attr("dy", 2)
		.text(function(d) { return d; });
	};

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0,0)")
	.call(xAxis);

	svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(0,0)")
	.call(yAxis);
});

function reset() {
	zoom.scale(1);
	zoom.translate([margin.left, margin.top]);
	svg.selectAll("rect")
	.attr("transform", 
		"translate(" + margin.left + "," + margin.top + ")scale(1)");
}

function zoom() {
	svg.selectAll("rect")
	.attr("transform", 
		"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	svg.selectAll("text")
	.attr("transform", 
		"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

	svg.select(".x.axis")
	.attr("transform", "translate(" + d3.event.translate[0]+",0)")
	.call(xAxis.scale(x.rangePoints([0, width * d3.event.scale], 
		d3.event.scale)));

	svg.select(".y.axis").attr("transform", 
		"translate(0," + d3.event.translate[0]+")")
	.call(yAxis.scale(y.rangePoints([0, height * d3.event.scale], 
		d3.event.scale)));
}

function getColorD3(value) {
	if(value == -2)
		value = 0;
if(checkFilterOutValue(value))    //if (value > -0.1 && value < 0.1 )
	return "hsl(0,0%,93%)";
var r=d3.scale.linear().domain([0,0.5]).range([10,360]);
return "hsl("+ r(value) +",100%,50%)"	;
}

function checkFilterOutValue(value) {
	if (value > 0.5)
		return true;
	else
		return false;
}