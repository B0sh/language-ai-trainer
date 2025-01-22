from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    # Example AI task
    response = {
        "input": data,
        "output": f"Processed data: {data['message']}"
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=6884)
