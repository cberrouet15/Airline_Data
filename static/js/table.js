d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv", function(error,data) {
        if (error) throw error;

        var sortAscending = true;
        var table = d3.select('#page-wrap').append('table');
        var titles = d3.keys(data[0]);
        var headers = table.append('thead').append('tr').selectAll('th').data(titles)
                        .enter().append('th')
                        .text(function(d){
                            return d;
                        }).on('click', function(d) {
                            headers.attr('class','header');
                            var isNumeric = data.every(function(row) { return !isNaN(row[d]) && row[d].trim() !== ""; });

                            rows.sort(function(a, b) {
                                var valA = isNumeric ? +a[d] : a[d].toLowerCase();  // Convert text to lowercase
                                var valB = isNumeric ? +b[d] : b[d].toLowerCase();  // Convert text to lowercase

                                return sortAscending ? d3.ascending(valA, valB) : d3.descending(valA, valB);
                            });

                            sortAscending = !sortAscending;
                            this.className = sortAscending ? 'aes' : 'des';
                        });

        var rows = table.append('tbody').selectAll('tr').data(data).enter().append('tr');

        rows.selectAll('td').data(function(d) {
            return titles.map(function(k) {
                return {'value':d[k], 'name':k};
                });
        }).enter().append('td').attr('data-th', function(d) {
            return d.name;
        }).text(function(d) {
                return d.value;
        });
    });

