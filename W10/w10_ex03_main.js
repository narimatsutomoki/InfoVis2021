var svg = d3.select('#drawing_region');

const circle = svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('fill', 'steelblue')
    .attr('r', 60);

function update(radius) {
  circle.attr('r', radius);
}

d3.select('#radius-slider')
    .on('input', function() {
        update(parseInt(this.value));
        d3.select('#radius-value').text(this.value);
    });
