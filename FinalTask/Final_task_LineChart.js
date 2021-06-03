class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(20)
            .tickSizeOuter(0);

        self.line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text(self.config.xlabel);

        const ylabel_space = 50;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text(self.config.ylabel);
    }

    update() {
        let self = this;
        self.agdata = self.data.filter(d => d.rainfall_sapporo);
        self.rainfall_sapporo = self.data.filter(d => d.rainfall_sapporo);
        console.log(self.data);
        self.yscale.domain([d3.max(self.rainfall_sapporo, d => d.y), 0]);

        self.circles = self.chart.selectAll("circle")
            .data(self.rainfall_sapporo)
            .enter()
            .append("circle");

        self.render(self.rainfall_sapporo);
    }

    render() {
        let self = this;
       
        self.chart.append('path')
            .attr('d', self.line(self.rainfall_sapporo))
            .attr('stroke', 'green')
            .attr('fill', 'none');

        self.circles
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", 5)
            .style("fill","black");

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
