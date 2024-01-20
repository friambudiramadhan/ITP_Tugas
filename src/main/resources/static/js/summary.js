const MAIN = {
    register: () => {
        MAIN.UI.register()
    },
    ENDPOINT: {
        GetListTransaksiTerbanyak: () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Summary/GetListTransaksiTerbanyak',
                    type: 'GET',
                    dataType: 'JSON',
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        GetListTransaksiTop5: () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Summary/GetListTransaksiTop5',
                    type: 'GET',
                    dataType: 'JSON',
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        },
        GetListTransaksiAll: () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:8080/Summary/GetListTransaksiAll',
                    type: 'GET',
                    dataType: 'JSON',
                    success: (result) => resolve(result),
                    error: (err) => reject(err)
                })
            })
        }
    },
    UI: {
        register: () => {
            MAIN.UI.GenerateChartDiv1()
            MAIN.UI.GenerateChartDiv2()
            MAIN.UI.GenerateChartDiv3()
        },
        GenerateChartDiv1: async () => {
            const fetchData = await MAIN.ENDPOINT.GetListTransaksiTerbanyak()
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdiv");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            var chart = root.container.children.push(
              am5percent.PieChart.new(root, {
                endAngle: 270
              })
            );

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            var series = chart.series.push(
              am5percent.PieSeries.new(root, {
                valueField: "TransactionCount",
                categoryField: "CustomerName",
                legendValueText: "{value}",
                endAngle: 270
              })
            );

            series.labels.template.set('text', '{category}: {value}');

            series.states.create("hidden", {
              endAngle: -90
            });

            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series.data.setAll(fetchData);

            series.appear(1000, 100);
        },
        GenerateChartDiv2: async () => {
            const fetchData = await MAIN.ENDPOINT.GetListTransaksiTop5()
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdiv2");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            var chart = root.container.children.push(
              am5percent.PieChart.new(root, {
                endAngle: 270
              })
            );

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            var series = chart.series.push(
              am5percent.PieSeries.new(root, {
                valueField: "TransactionCount",
                categoryField: "CustomerName",
                legendValueText: "{value}",
                endAngle: 270
              })
            );

            series.labels.template.set('text', '{value}');

            series.states.create("hidden", {
              endAngle: -90
            });

            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series.data.setAll(fetchData);

            series.appear(1000, 100);
        },
        GenerateChartDiv3: async () => {
            const fetchData = await MAIN.ENDPOINT.GetListTransaksiAll()
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdiv3");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
              am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(am5xy.XYChart.new(root, {
              panX: true,
              panY: true,
              wheelX: "panX",
              wheelY: "zoomX",
              pinchZoomX: true,
              paddingLeft:0,
              paddingRight:1
            }));

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
            cursor.lineY.set("visible", false);


            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {
              minGridDistance: 30,
              minorGridEnabled: true
            });

            xRenderer.labels.template.setAll({
              rotation: -90,
              centerY: am5.p50,
              centerX: am5.p100,
              paddingRight: 15
            });

            xRenderer.grid.template.setAll({
              location: 1
            })

            var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
              maxDeviation: 0.3,
              categoryField: "CustomerName",
              renderer: xRenderer,
              tooltip: am5.Tooltip.new(root, {})
            }));

            var yRenderer = am5xy.AxisRendererY.new(root, {
              strokeOpacity: 0.1
            })

            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
              maxDeviation: 0.3,
              renderer: yRenderer
            }));

            // Create series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
              name: "Series 1",
              xAxis: xAxis,
              yAxis: yAxis,
              valueYField: "TransactionCount",
              sequencedInterpolation: true,
              categoryXField: "CustomerName",
              tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
              })
            }));

            series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
            series.columns.template.adapters.add("fill", function (fill, target) {
              return chart.get("colors").getIndex(series.columns.indexOf(target));
            });

            series.columns.template.adapters.add("stroke", function (stroke, target) {
              return chart.get("colors").getIndex(series.columns.indexOf(target));
            });


            // Set data
            var data = fetchData;

            xAxis.data.setAll(data);
            series.data.setAll(data);


            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear(1000);
            chart.appear(1000, 100);
        }
    }
}

$(document).ready(() => {
    MAIN.register()
})