d3.csv("https://narimatsutomoki.github.io/InfoVis2021/W08/w08_ex02.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 40, right: 10, bottom: 40, left: 40 },
            padding: 10,
            radius: 3,
            shown_radius: 5,
            color: "black",
            shown_color: "red"
        };

        const line_chart = new LineChart(config, data);
        line_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            padding: config.padding || 10,
            radius: config.radius || 3,
            shown_radius: config.shown_radius || 5,
            color: config.color || "black",
            shown_color: config.shown_color || "red"
        }
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
            .range([0, self.inner_height])

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.chart.append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", self.inner_height + self.config.margin.bottom)
            .text("x");

        self.yaxis_group = self.chart.append('g');

        self.chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - self.config.margin.left / 1.5)
            .attr("x", - self.inner_height / 2)
            .text("y");

        self.chart.append("text")
            .attr("x", self.inner_width / 5)
            .attr("y", 0 - self.config.margin.top / 3)
            .style("font-size", '24px')
            .style("font-weight", 'bold')
            .text("sample data");
    }

    update() {
        let self = this;

        self.xscale.domain([d3.min(self.data, d => d.x), d3.max(self.data, d => d.x)]);
        self.yscale.domain([d3.max(self.data, d => d.y), 0]);

        self.circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle");

        self.render("");

        self.circles
            .on('mouseover', function(e, d) {
                self.render(d.label);
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.label}</div>(${d.x}, ${d.y})`);
            })
            .on('mousemove', (e) => {
                d3.select('#tooltip')
                    .style('left', (e.pageX + self.config.padding) + 'px')
                    .style('top', (e.pageY + self.config.padding) + 'px');
            })
            .on('mouseleave', () => {
                self.render("");
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

    }

    render(pointed_label) {
        let self = this;
        self.chart.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'green')
            .attr('fill', 'none');

        self.circles
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => {
                if (d.label == pointed_label) return self.config.shown_radius;
                return self.config.radius;
            })
            .style("fill", d => {
                if (d.label == pointed_label) return self.config.shown_color;
                return self.config.color;
            });

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
