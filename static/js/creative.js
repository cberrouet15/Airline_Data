d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv", function(error, data) {
            if (error) throw error;


            var nestedData = d3.nest()
                .key(function(d) { return d.airline; })
                .key(function(d) { return d.airline_sentiment; })
                .rollup(function(v) { return v.length; })
                .entries(data);


            var airlines = nestedData.map(function(d) { return d.key; });
            var sentiments = ["positive", "neutral", "negative"];

            var transformedData = [];
            nestedData.forEach(function(airline) {
                sentiments.forEach(function(sentiment) {
                    var sentimentData = airline.values.find(function(d) { return d.key === sentiment; });
                    transformedData.push({
                        airline: airline.key,
                        sentiment: sentiment,
                        count: sentimentData ? sentimentData.values : 0
                    });
                });
            });


            var width = 800, height = 500;
            var margin = { top: 50, right: 30, bottom: 100, left: 60 };
            var chartWidth = width - margin.left - margin.right;
            var chartHeight = height - margin.top - margin.bottom;

            var svg = d3.select("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Create scales
            var x0 = d3.scale.ordinal()
                .domain(airlines)
                .rangeRoundBands([0, chartWidth], 0.2);

            var x1 = d3.scale.ordinal()
                .domain(sentiments)
                .rangeRoundBands([0, x0.rangeBand()]);

            var y = d3.scale.linear()
                .domain([0, d3.max(transformedData, function(d) { return d.count; })])
                .range([chartHeight, 0]);

            var color = d3.scale.ordinal()
                .domain(sentiments)
                .range(["#2ca02c", "#ff7f0e", "#d62728"]); // Green, Orange, Red


            var xAxis = d3.svg.axis().scale(x0).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left");


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-40)");


            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("x", -chartHeight / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Tweet Count");


            var airlineGroups = svg.selectAll(".airline-group")
                .data(nestedData)
                .enter().append("g")
                .attr("class", "airline-group")
                .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; });

            airlineGroups.selectAll("rect")
                .data(function(d) { return d.values; })
                .enter().append("rect")
                .attr("x", function(d) { return x1(d.key); })
                .attr("width", x1.rangeBand())
                .attr("y", function(d) { return y(d.values); })
                .attr("height", function(d) { return chartHeight - y(d.values); })
                .style("fill", function(d) { return color(d.key); });


            var legend = svg.selectAll(".legend")
                .data(sentiments)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", chartWidth - 20)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", chartWidth - 25)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
        });