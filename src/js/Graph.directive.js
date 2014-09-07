calculator.directive('graph', function () {
  var margin = {top: 20, right: 20, bottom: 30, left: 60},
      width = 750 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  return {
    link: function (scope, element, attrs) {
      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10, "$");

      var path, xAxisElement, yAxisElement, bars;

      var line = d3.svg.line()
          .x(function(d) { return x(d.term); })
          .y(function(d) { return y(d.total); })
          .interpolate('monotone');

      var svg = d3.select(element[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      scope.$watch('data', function (newVal, oldVal) {
        var total = 0;

        var points = _.flatten(_.map(data.years, function(year) {
          return _.map(year, function(term) {
            var gross = _.reduce(term.fields, function(acc, field) {
              return acc + ((field.multiplier || 1) * (field.value || 0));
            }, 0);

            var classes = [];
            if (gross < 0) {
              classes.push('unprofitable');
            } else if (gross > 0) {
              classes.push('profitable');
            }

            return {
              term: _.last(term.id.split("_")),
              gross: gross,
              total: (total = total + gross),
              classes: classes
            };
          });
        }));

        x.domain(points.map(function(d) { return d.term; }));
        y.domain(d3.extent(points, function(d) { return d.total; })).range([height, 0]).nice();

        var grandTotal = points[points.length - 1].total;

        //  TODO: For code cleanliness, this shouldn't be in here.
        document.getElementById('total').innerHTML =
          Math.abs(grandTotal).toLocaleString(
            undefined,
            {
              style: 'currency',
              currency: "CAD",
              minimumFractionDigits: 2,
            }
          ).replace("CA", "");

        if (grandTotal >= 0) {
          document.getElementById('earnings').classList.add('positive');
          document.getElementById('earnings').classList.remove('negative');
        } else {
          document.getElementById('earnings').classList.remove('positive');
          document.getElementById('earnings').classList.add('negative');
        }

        if (!xAxisElement) {
          xAxisElement = svg.append("g");
        }

        xAxisElement
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .text("Term")
          .call(xAxis);

        if (!yAxisElement) {
          yAxisElement = svg.append("g");
        }

        yAxisElement
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("Debt or Profit");

        if (!bars) {
          bars = svg
            .selectAll(".bar")
            .data(points)
            .enter().append("rect");
        }

        bars
          .data(points)
          .transition()
          .attr("class", function(d) { return 'bar ' + (d.classes || ''); })
          .attr("x", function(d) { return x(d.term); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(Math.max(0, d.gross)); })
          .attr("height", function(d) { return Math.abs(y(d.gross) - y(0)); });

        if (!path) {
          path = svg.append("path");
        }

        path
          .datum(points)
          .transition()
          .attr("class", "line")
          .attr("transform", "translate(" + (x.rangeBand() / 2) + ", 0)")
          .attr("d", line);
      }, true);
    },
  };
});
  
