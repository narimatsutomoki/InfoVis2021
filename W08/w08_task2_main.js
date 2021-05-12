d3.csv("https://narimatsutomoki.github.io/InfoVis2021/W04/w04_task2.csv")
    .then(data => {

        var config = {
            parent: '#drawing_region',
            width: 1000,
            height: 3500,
            margin: { top: 50, right: 10, bottom: 50, left: 100 }
        };

        const bar_chart = new BarChart(config, data);
        bar_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

class BarChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
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

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(10)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.chart.append("text")
            .attr("x", self.inner_width / 2)
            .attr("y", self.inner_height + self.config.margin.bottom)
            .text("infections");

        self.yaxis_group = self.chart.append('g');

        self.chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - self.config.margin.left / 1.5)
            .attr("x", - self.inner_height / 2)
            .text("date");

        self.chart.append("text")
            .attr("x", self.inner_width / 5)
            .attr("y", 0 - self.config.margin.top / 3)
            .style("font-size", '24px')
            .style("font-weight", 'bold')
            .text("Infections of COVID-19 in Osaka");
    }

    update() {
        let self = this;

        self.xscale.domain([0, 300 + parseInt(d3.max(self.data, d => d.x))]);
        self.yscale.domain(self.data.map(d => d.date));

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.date))
            .attr("width", d => self.xscale(d.x))
            .attr("height", self.yscale.bandwidth())
            .style("fill", function (d) { return d.color; });

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
