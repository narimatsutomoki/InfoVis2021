var data = [100,50,80,20];

var svg = d3.select('#drawing_region');
update( data );

function update(data) {
    let padding = 10;
    let height = 20;
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", padding)
        .attr("y", (d,i) => padding + i * ( height + padding ))
        .attr("width", d => d)
        .attr("height", height);
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        update(data);
    });
