class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
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

        self.xscale = d3.scaleBand()
            .range([0, self.inner_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(['setosa','versicolor','virginica'])
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        const data_map = d3.rollup( self.data, v => v.length, d => d.species );
        self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );

        self.cvalue = d => d.key;
        self.xvalue = d => d.key;
        self.yvalue = d => d.count;

        const items = self.aggregated_data.map( self.xvalue );
        self.xscale.domain(items);

        const ymin = 0;
        const ymax = d3.max( self.aggregated_data, self.yvalue );
        self.yscale.domain([ymin, ymax]);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.aggregated_data)
            .join("rect")
            .attr("x", d => self.xscale( self.xvalue(d) ) )
            .attr("y", d => self.yscale( self.yvalue(d) ) )
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
            .attr("fill", d => self.config.cscale( self.cvalue(d) ));

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
