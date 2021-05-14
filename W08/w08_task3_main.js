d3.csv("https://narimatsutomoki.github.io/InfoVis2021/W08/w08_task3.csv")
    .then(data => {
        //data.forEach(d => { d.type = +d.type; d.percentage = +d.percentage; });
        var config = {
            parent: '#drawing_region',
            width: 400,
            height: 400,
            margin: { top: 40, right: 10, bottom: 40, left: 40 },
            radius: 100
        };

        const pie_chart = new PieChart(config, data);
        pie_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

class PieChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            radius: config.radius || 100
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.pie = d3.pie()
            .value(d => d.percentage);

        self.arc = d3.arc()
            .innerRadius(self.config.radius/2)
            .outerRadius(self.config.radius);

        self.svg.append("text")
            .attr("x", self.config.margin.left/2)
            .attr("y", self.config.margin.top)
            .style("font-size", '20px')
            .style("font-weight", 'bold')
            .text("percentage of blood types in India");

        
    }

    update() {
        let self = this;

        self.color = d3.scaleOrdinal()
            .domain(self.data.map(d => d.type))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), self.data.length).reverse());

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', d => self.color(d.data.type))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
        self.chart.selectAll('text')
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("transform", d => "translate(" + self.arc.centroid(d) + ")")
            .attr("dy", "5px")
            .attr("font", "10px")
            .attr("text-anchor", "middle")
            .text(d => d.data.type+"("+d.data.percentage+"%)");
    }
}
