d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W12/iris.csv")
    .then( data => {
        data.forEach( d => {
            d.sepal_length = +d.sepal_length;
            d.sepal_width = +d.sepal_width;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            title: 'Iris Flower Data',
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm]',
            cscale: color_scale
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });
