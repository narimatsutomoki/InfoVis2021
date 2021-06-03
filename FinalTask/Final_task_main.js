/*d3.csv("https://narimatsutomoki.github.io/InfoVis2021/FinalTask/honhyo_2019.csv")
    .then(data => {
        var config = {
            parent: '#drawing_region_barchart',
            width: 1000,
            height: 3500,
            margin: { top: 50, right: 10, bottom: 50, left: 100 },
            date: '#date',
            descend: '#descend',
            ascend: '#ascend'
        };

        const bar_chart = new BarChart(config, data);
        bar_chart.update();
    })
    .catch(error => {
        console.log(error);
    });*/

d3.text("https://narimatsutomoki.github.io/InfoVis2021/FinalTask/weather_2019.csv")
    .then(data => {
        console.log(data.length)
    });
/*d3.csv("https://narimatsutomoki.github.io/InfoVis2021/FinalTask/weather_2019.csv")
    
    .then(data => {
        var config = {
            parent: '#drawing_region_linechart',
            width: 1000,
            height: 3500,
            margin: { top: 50, right: 10, bottom: 50, left: 100 },
            date: '#date',
            descend: '#descend',
            ascend: '#ascend'
        };

        const line_chart = new LineChart(config, data);
        line_chart.update();
    })
    .catch(error => {
        console.log(error);
    });*/