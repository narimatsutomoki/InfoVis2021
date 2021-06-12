class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            padding: 10
        };
        this.data = data;
        this.xlabel = "Number of traffic accidents"
        this.ylabel = "Amount of rainfall(mm)";
        this.xvalue = d => d.accident_sapporo;
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

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width*3/4] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');


        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 3)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .attr('id', "xl2")
            .text(self.xlabel);

        const ylabel_space = 45;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .attr('id', "yl2");

        self.svg.append('text')
            .style('font-size', '22px')
            .attr('x', 70)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('id', "point");

        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width - 60)
            .attr('y', self.config.height / 2)
            .attr('text-anchor', 'middle')
            .text("correlation coefficient = ");

        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width - 60)
            .attr('y', self.config.height / 2 + 15)
            .attr('text-anchor', 'middle')
            .attr('id', "cor");
    }

    cor() {
        let self = this;
        var m = Math, n;
        n = self.data.length;
        var sumx = 0, sumy = 0
            , xm, ym, xxi, yyi
            , sumxxm = 0, sumyym = 0, sumxym = 0
            , i;
        // ëçòaéZèo
        for (i = 0; i < n; i++) {
            if (point == "Sapporo") {
                sumx += self.data[i]["accident_sapporo"];
                sumy += Number(self.data[i][tenki + "_sapporo"]);
            }
            else {
                sumx += self.data[i]["accident_tokyo"];
                sumy += Number(self.data[i][tenki + "_tokyo"]);
            }
        }
        // ïΩãœéZèo
        xm = sumx / n;
        ym = sumy / n;
        for (i = 0; i < n; i++) {
            if (point == "Sapporo") {
                xxi = self.data[i]["accident_sapporo"];
                yyi = Number(self.data[i][tenki + "_sapporo"]);
                sumxxm += (xxi - xm) * (xxi - xm);
                sumyym += (yyi - ym) * (yyi - ym);
                sumxym += (xxi - xm) * (yyi - ym);
            }
            else {
                xxi = self.data[i]["accident_tokyo"];
                yyi = Number(self.data[i][tenki + "_tokyo"]);
                sumxxm += (xxi - xm) * (xxi - xm);
                sumyym += (yyi - ym) * (yyi - ym);
                sumxym += (xxi - xm) * (yyi - ym);
            }
        }

        return sumxym / m.sqrt(sumxxm) / m.sqrt(sumyym);
    }

    update() {
        let self = this;

        const xmin = 0;
        const xmax = d3.max(self.data, self.xvalue);
        self.xscale.domain([xmin, xmax]);

        self.yscale.domain([0, d3.max(self.data, d => Number(self.display(d)))]);

        document.getElementById("point").textContent = point;
        document.getElementById("yl2").textContent = self.ylabel;
        document.getElementById("cor").innerHTML = self.cor().toFixed(3);
        
        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        circles
            .attr("cx", d => self.xscale( self.xvalue(d) ) )
            .attr("cy", d => self.yscale(self.display(d)))
            .attr("r", d => {
                if (d.date == self.pointed_date) return 5;
                return 3;
            })
            .attr("fill", d => {
                if (d.date == self.pointed_date) return "pink";
                return self.color;
            })
            .on('mouseover', (e, d) => {
                self.pointed_date = d.date;
                change_color(self.pointed_date);
                self.render();
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.date}</div>(${self.xvalue(d)}, ${self.display(d)})`);
            })
            .on('mousemove', (e) => {
                d3.select('#tooltip')
                    .style('left', (e.pageX + self.config.padding) + 'px')
                    .style('top', (e.pageY + self.config.padding) + 'px');
            })
            .on('mouseleave', () => {
                self.pointed_date = "";
                change_color(self.pointed_date);
                self.render();
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}
