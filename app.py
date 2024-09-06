from flask import Flask, request, jsonify, send_file, send_from_directory, redirect, url_for
from hdf5_processing import process_hdf5 as process_hdf5_function


import os

app = Flask(__name__, static_folder='../hdf5-upload-app/build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/process_hdf5', methods=['POST'])
def process_hdf5_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    selected_band = request.form.get('selected_band')
    file_path = f"/tmp/{file.filename}"
    file.save(file_path)
    
    try:
        cog_output_tiff = process_hdf5_function(file_path, selected_band)
        return send_file(cog_output_tiff, as_attachment=True, download_name=f"{selected_band}_COG.tif")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/thank_you')
def thank_you():
    return '<h1>Thanks</h1>'

if __name__ == '__main__':
    app.run(port=8000, debug=True)
