d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W12/iris.csv")
    .then( data => {

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        var config = {
            parent: '#drawing_region',
            width: 300,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            cscale: color_scale
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
