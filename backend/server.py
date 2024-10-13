# From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)


# Go to http://localhost:9874/data to see the data
@app.route('/data')
def get_time():

    # Returning an api for showing in reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
        }

    
# Running app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=9874)