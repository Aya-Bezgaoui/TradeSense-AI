from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({
        "status": "alive",
        "message": "The Empty Kernel is Running",
        "env_python": "Works"
    })

# Required for Vercel
if __name__ == '__main__':
    app.run()