class BarChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel,
            rainfall: config.rainfall,
            sunlight: config.sunlight,
            snowfall: config.snowfall,
            avewind: config.avewind,
            padding: 10
        };
        this.data = data;
        this.ylabel = "Number of traffic accidents"
        this.yvalue = d => d.accident_sapporo;
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
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            //2019/**/1‚ðƒvƒƒbƒg
            .tickValues(self.xscale.domain().filter(function (d, i) {
                if (d.slice(-2) == "/1") return d;
            }))
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(20)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.yscale2 = d3.scaleLinear()
            .range([0, self.inner_height]);
        self.yaxis2 = d3.axisRight(self.yscale2)
            .ticks(20)
            .tickSizeOuter(0);

        self.yaxis_group2 = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width}, 0)`);

        const ylabel_space = 50;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text("Number of traffic accidents")

        const ylabel2_space = 70;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.width - ylabel2_space)
            .attr('x', -(self.inner_height) / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .attr('id', "ylb2");
        self.acc = true;
        self.wea = true;
    }

    update() {
        let self = this;

        self.cvalue = d => d.key;
        self.xvalue = d => d.key;

        const ymin = 0;
        const ymax = d3.max(self.data, self.yvalue);
        self.yscale.domain([ymin, ymax]);
        self.yscale2.domain([d3.max(self.data, d => Number(self.display(d))), 0]);

        document.getElementById("ylb2").textContent = self.ylabel;

        self.render();
    }

    render() {
        let self = this;

        let rects_acc = self.chart.selectAll("rect.acc")
            .data(self.data).join("rect")
            .attr("class", "acc");
        let rects_wea = self.chart.selectAll("rect.wea")
            .data(self.data).join("rect")
            .attr("class", "wea");

         rects_acc
                .attr("x", d => self.xscale(self.xvalue(d)))
                .attr("y", d => self.yscale(self.yvalue(d)))
                .attr("width", self.xscale.bandwidth() / 4)
                .attr("height", d => {
                  if (!self.acc) return 0;
                  return self.inner_height - self.yscale(self.yvalue(d))
                })
             .style("fill", d => {
                 if (self.xvalue(d) == point_date) return "pink";
                 return "black";
             })
                .style("fill-opacity", d => {
                    if (self.pointed_date == self.xvalue(d)) return 0.5;
                    return 1;
                })
             .on('mouseover', (e, d) => {
                    self.pointed_date = self.xvalue(d);
                    self.render();
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">${self.xvalue(d)}</div>(${self.xvalue(d)}, accidents: ${self.yvalue(d)})`);
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
                })
                .on('click', () => {
                    if (self.wea) {
                        self.wea = false;
                    }
                    else {
                        self.wea = true;
                    }
                    self.render();
                });
        
            rects_wea
                .attr("x", d => self.xscale(self.xvalue(d)) + self.xscale.bandwidth() / 2)
                .attr("y", d => self.yscale2(self.display(d)))
                .attr("width", self.xscale.bandwidth() / 4)
                .attr("height", d => {
                    if (!self.wea) return 0;
                    return self.inner_height - self.yscale2(self.display(d));
                })
                .style("fill", d => {
                    if (self.xvalue(d) == point_date) return "pink";
                    return self.color;
                })
                .style("fill-opacity", d => {
                    if (self.pointed_date == self.xvalue(d)) return 0.5;
                    return 1;
                })
                .on('mouseover', (e, d) => {
                    self.pointed_date = d.date;
                    self.render();
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">${d.date}</div>(${d.date}, weather: ${self.display(d)})`);
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
                })
                .on('click', () => {
                    if (self.acc) {
                        self.acc = false;
                    }
                    else {
                        self.acc = true;
                    }
                    self.render();
                });

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);

        self.yaxis_group2
            .call(self.yaxis2);
        
    }
}

