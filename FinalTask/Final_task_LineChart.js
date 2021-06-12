class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel || '',
            padding: 10
        };
        this.data = data;
        this.ylabel = "Amount of rainfall(mm)";
        this.display = d => d.rainfall_sapporo;
        this.color = "blue";
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
            .domain(self.data.map(d => d.date));

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            //2019/**/1‚ðƒvƒƒbƒg
            .tickValues(self.xscale.domain().filter(function (d, i) {
                if (d.slice(-2)=="/1") return d;
            }))
            .tickSizeOuter(0);

        self.yaxis = d3.axisRight(self.yscale)
            .ticks(20)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width}, 0)`);

        
    }

    update() {
        let self = this;

        self.yscale.domain([d3.max(self.data, d => Number(self.display(d))), 0]);

        const ylabel_space = 70;
        let ylabel = self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.width - ylabel_space)
            .attr('x', -(self.inner_height) / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .attr('id', "yl");
        document.getElementById("yl").textContent = self.ylabel;

        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        circles
            .attr("cx", d => self.xscale(d.date))
            .attr("cy", d =>  self.yscale(self.display(d)))
            .attr("r", d => {
                if (d.date == self.pointed_date) return 5;
                return 3;
            })
            .style("fill", self.color)
            .on('mouseover', function (e, d) {
                self.pointed_date = d.date;
                self.render();
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.date}</div>(${d.date}, ${self.display(d)})`);
            })
            .on('mousemove', (e, d) => {
               
                d3.select('#tooltip')
                    .style('left', (e.pageX + self.config.padding) + 'px')
                    .style('top', (e.pageY + self.config.padding) + 'px');
            })
            .on('mouseleave', () => {
                self.pointed_date = "";
                self.render();
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        /*let l = d3.line()
            .x(d => self.xscale(d.date))
            .y(d => self.yscale(self.display(d)));

        let lines = self.chart.append('path');
        lines
            .attr('d', l(self.data))
            .attr('stroke', 'green');*/
    
        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
        
    }
}
