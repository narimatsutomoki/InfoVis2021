let input_data;
let scatter_plot;
let bar_chart;
let point = "in Sapporo";
let tenki = "rainfall";
let point_date="";

var config_scatter = {
    parent: '#drawing_region_scatter',
    width: 500,
    height: 300,
    margin: { top: 50, right: 50, bottom: 50, left: 150 },
    xlabel: 'Number of traffic accidents',
    padding: 10
};

var config_bar = {
    parent: '#drawing_region_bar',
    width: 1500,
    height: 400,
    margin: { top: 50, right: 100, bottom: 50, left: 100 },
    xlabel: 'Date',
    padding :10
};

Promise.all([
    d3.csv("https://narimatsutomoki.github.io/InfoVis2021/FinalTask/honhyo_2019.csv"),
    d3.csv("https://narimatsutomoki.github.io/InfoVis2021/FinalTask/weather_2019.csv"),
]).then(function (files) {
    //データ整理
    const sapporo = files[0].filter(d => d.local_code == 10 && d.year == 2019);
    const tokyo = files[0].filter(d => d.local_code == 30 && d.year == 2019);
    const data_map_sapporo = d3.rollup(sapporo, v => v.length, d => d.year + "/" + d.month + "/" + d.day);
    const data_map_tokyo = d3.rollup(tokyo, v => v.length, d => d.year + "/" + d.month + "/" + d.day);
    const aggregated_data_sapporo = Array.from(data_map_sapporo, ([key, count]) => ({ [key]: count })).sort((a, b) => new Date(a.key) - new Date(b.key));
    const aggregated_data_tokyo = Array.from(data_map_tokyo, ([key, accident_tokyo]) => ({ key, accident_tokyo })).sort((a, b) => new Date(a.key) - new Date(b.key));
    var start = new Date("2019-1-1");
    var end = new Date("2019-12-31");
    const result = aggregated_data_sapporo.reduce((l, r) => Object.assign(l, r), {});
    //欠損値補填
    for (var d = start, i = 0; d <= end; d.setDate(d.getDate() + 1), i += 1) {
        keyd = "2019/" + (d.getMonth() + 1) + "/" + d.getDate();
        if (result[keyd] == null) {
            result[keyd] = 0;
        }
    }
    //2データの結合
    const sapporo_acc = Object.entries(result).map(([key, accident_sapporo]) => ({ key, accident_sapporo })).sort((a, b) => new Date(a.key) - new Date(b.key));

    var n = Object.keys(sapporo_acc);
    let scat = [];
    for (var i = 0; i < n.length; i++) {
        scat[n[i]] = Object.assign(files[1][n[i]], sapporo_acc[n[i]], aggregated_data_tokyo[n[i]]);
    }
    input_data = scat;

    scatter_plot = new ScatterPlot(config_scatter, input_data);
    scatter_plot.update();
    bar_chart = new BarChart(config_bar, input_data);
    bar_chart.update();

}).catch(function (err) {
    console.log(err);
})

d3.select('#switch')
    .on('click', e => {
        if (point == "in Sapporo") {
            bar_chart.yvalue = d => d.accident_tokyo;
            scatter_plot.xvalue = d => d.accident_tokyo;
            document.getElementById("switch").textContent = "Sapporo";
            point = "in Tokyo";
            if (tenki == "rainfall") {
                bar_chart.display = d => d.rainfall_tokyo;
                scatter_plot.display = d => d.rainfall_tokyo;
            }
            else if (tenki == "sunlight") {
                bar_chart.display = d => d.sunlight_tokyo;
                scatter_plot.display = d => d.sunlight_tokyo;
            }
            else if (tenki == "snowfall") {
                bar_chart.display = d => d.snowfall_tokyo;
                scatter_plot.display = d => d.snowfall_tokyo;
            }
            else {
                bar_chart.display = d => d.avewind_tokyo;
                scatter_plot.display = d => d.avewind_tokyo;
            }
        }
        else {
            bar_chart.yvalue = d => d.accident_sapporo;
            scatter_plot.xvalue = d => d.accident_sapporo;
            document.getElementById("switch").textContent = "Tokyo";
            point = "in Sapporo";
            if (tenki == "rainfall") {
                bar_chart.display = d => d.rainfall_sapporo;
                scatter_plot.display = d => d.rainfall_sapporo;
            }
            else if (tenki == "sunlight") {
                bar_chart.display = d => d.sunlight_sapporo;
                scatter_plot.display = d => d.sunlight_sapporo;
            }
            else if (tenki == "snowfall") {
                bar_chart.display = d => d.snowfall_sapporo;
                scatter_plot.display = d => d.snowfall_sapporo;
            }
            else {
                bar_chart.display = d => d.avewind_sapporo;
                scatter_plot.display = d => d.avewind_sapporo;
            }
        }
        bar_chart.update();
        scatter_plot.update();
    });

d3.select('#rainfall')
    .on('click', e => {
        bar_chart.ylabel = "Amount of rainfall(mm)";
        scatter_plot.ylabel = "Amount of rainfall(mm)";
        if (point == "in Sapporo") {
            bar_chart.display = d => d.rainfall_sapporo;
            scatter_plot.display = d => d.rainfall_sapporo;
        }
        else {
            bar_chart.display = d => d.rainfall_tokyo;
            scatter_plot.display = d => d.rainfall_tokyo;
        }
        bar_chart.color = "blue";
        scatter_plot.color = "blue";
        tenki = "rainfall";
        bar_chart.update();
        scatter_plot.update();
    });

d3.select("#sunlight")
    .on('click', e => {
        bar_chart.ylabel = "Daylight hours(h)";
        scatter_plot.ylabel = "Daylight hours(h)";
        if (point == "in Sapporo") {
            bar_chart.display = d => d.sunlight_sapporo;
            scatter_plot.display = d => d.sunlight_sapporo;
        }
        else {
            bar_chart.display = d => d.sunlight_tokyo;
            scatter_plot.display = d => d.sunlight_tokyo;
        }
        bar_chart.color = "red";
        scatter_plot.color = "red";
        tenki = "sunlight"
        bar_chart.update();
        scatter_plot.update();
    });

d3.select("#snowfall")
    .on('click', e => {
        bar_chart.ylabel = "Amount of snowfall(cm)";
        scatter_plot.ylabel = "Amount of snowfall(cm)";
        if (point == "in Sapporo") {
            bar_chart.display = d => d.snowfall_sapporo;
            scatter_plot.display = d => d.snowfall_sapporo;
        }
        else {
            bar_chart.display = d => d.snowfall_tokyo;
            scatter_plot.display = d => d.snowfall_tokyo;
        }
        bar_chart.color = "steelblue";
        scatter_plot.color = "steelblue";
        tenki = "snowfall";
        bar_chart.update();
        scatter_plot.update();
    });

d3.select("#avewind")
    .on('click', e => {
        bar_chart.ylabel = "Average of wind speed(m/s)";
        scatter_plot.ylabel = "Average of wind speed(m/s)";
        if (point == "in Sapporo") {
            bar_chart.display = d => d.avewind_sapporo;
            scatter_plot.display = d => d.avewind_sapporo;
        }
        else {
            bar_chart.display = d => d.avewind_tokyo;
            scatter_plot.display = d => d.avewind_tokyo;
        }
        bar_chart.color = "green";
        scatter_plot.color = "green";
        tenki = "avewind";
        bar_chart.update();
        scatter_plot.update();
    });

function change_color(pointed_date) {
    point_date = pointed_date;
    bar_chart.update();
}