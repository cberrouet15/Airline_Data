from flask import Flask, render_template
app = Flask(__name__)
import csv
import itertools

@app.route('/')
def index():
    return 'Welcome to Fundamentals of Computer Science'

@app.route('/advanced')
def display_data_d3():
    return render_template("advanced.html")

@app.route('/creative')
def display_data_creative():
    return render_template("creative.html")

@app.route('/basic')
def display_data():
    with open('static/data/Kaggle_TwitterUSAirlineSentiment.csv', encoding='utf-8-sig') as csv_file:
        data = csv.reader(csv_file, delimiter=',')
        first_line = True
        tweetData = []

        for row in itertools.islice(data, 41):
            if not first_line:
                tweetData.append({
                        "id": row[0],
                        "airline_sentiment": row[1],
                        "airline_sentiment_confidence": row[2],
                        "airline": row[4],
                        "text": row[6],
                    })

            else:
                first_line = False

        def bubble_sort_data(table, key_column):
            n = len(table)
            for i in range(n):
                for j in range(0, n - i - 1):
                    if table[j][key_column] > table[j + 1][key_column]:
                        table[j], table[j + 1] = table[j + 1], table[j]

        bubble_sort_data(tweetData, "airline_sentiment_confidence")

    return render_template("basic.html", tweetData=tweetData)

app.run(host='0.0.0.0', port=81)