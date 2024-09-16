from PAMI.subgraphMining.basic import frequentSubgraph
from PAMI.GraphTransactionalCoveragePattern.basic import GTCP as alg
from http.client import responses
import json
import flask
from flask import Flask, redirect, url_for, request, render_template, send_file, jsonify
import werkzeug
from werkzeug.utils import secure_filename
from flask import Flask, Response
from flask_cors import CORS, cross_origin
from flask import send_from_directory
from PAMI.extras.stats import graphDatabase as alg
import os
from PAMI.subgraphMining.basic import gspan as gsp
# from PAMI.GraphTransactionalCoveragePattern.basic import GTCP
from GTCP import GTCP as gtc
from contextlib import redirect_stdout
import argparse
from graph import graphDatabase
from pymongo import MongoClient
from bson.objectid import ObjectId
import base64
from io import BytesIO



client = MongoClient('localhost', 27017)

db = client['gcp']

HOST = None
PORT = 5000

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
UPLOAD_FOLDER = 'Datasets'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, support_credentials=True)
data_path = "./Datasets"
global dic
dic = {"Yeast": "yeast.txt"}


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response





@app.route("/dataset_upload", methods=["POST"])
@cross_origin(supports_credentials=True, origin='*')
def dataset_upload():
    print("came here")
    collection=db["datasets"]
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
   
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        print("hellllo uploading document")
        # Insert the file metadata into MongoDB
        file_metadata = {'file_name': file.filename}
        insert_result = collection.insert_one(file_metadata)
        file_id = str(insert_result.inserted_id)

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}.txt")
        file.save(file_path)

        return jsonify({'message': 'File successfully uploaded', 'file_id': file_id}), 200



@app.route("/get_datasets_algos", methods=["GET"])
@cross_origin(supports_credentials=True, origin='*')
def get_datasets_algos():
    files = []
    collection=db["datasets"]
    for doc in collection.find():
        files.append({'id': str(doc['_id']), 'file_name': doc['file_name'][:-4]})
    return {"datasets": files, "subgraph_algos": ["gSpan"], "pattern_algos": ["GTCP"]}


@app.route("/mine_patterns", methods=["POST"])
@cross_origin(supports_credentials=True, origin='*')
def mine_patterns():
    data = json.loads(request.data)
    dataset = data["dataset"]
    subgraph_algorithm = data["subgraph_algo"]
    patterns = data["patterns"]
    minsup = data["minsup"]
    mingtc = data["mingtc"]
    maxor = data["maxor"]
    mingtpc = data["mingtpc"]
    return {200: 200}


@app.route("/mineSubgraphs", methods=["POST"])
@cross_origin(supports_credentials=True, origin='*')
def mineSubgraphs():
    data = json.loads(request.data)
    dataset = data["dataset"]
    subgraph_algorithm = data["subgraph_algo"]
    minsup = data["minsup"]
    print(data,"****************")
    collections=db["datasets"]
    obj_id = ObjectId(dataset)
    doc=collections.find_one({"_id":obj_id})
    dpath=os.path.join("Datasets",dataset+".txt")
    obj = alg.graphDatabase(iFile=dpath)
    import sys
    from contextlib import redirect_stdout

    with open('stats.txt', 'w') as file:
        with redirect_stdout(file):
            obj.printGraphDatabaseStatistics()

    file_content = []
    with open('stats.txt', 'r') as file:
        file_content = file.read()
    file_content = file_content.split("\n")
    print("Started");
    obj = gsp.GSpan(dpath, minsup, False, float("inf"), False)

    obj.mine()
    obj.saveSubgraphsByGraphId("temp.txt")
    print("miniing .....")
    frequentGraphs = obj.getFrequentSubgraphs()
    memUSS = obj.getMemoryUSS()
    print("Total Memory in USS:", memUSS)
    memRSS = obj.getMemoryRSS()
    print("Total Memory in RSS", memRSS)
    run = obj.getRuntime()
    print("Total ExecutionTime in seconds:", run)
    obj.save('frequentSupgraphs.txt')

    num=len(obj.frequentSubgraphs)
    image_url = url_for('static', filename='subgraphs.jpg')
    file_content=file_content[:-1]
    file_content.append("number of frequent graphs: {}".format(num))
    # print("d")

    return {"file_content": file_content,"subgraphs":image_url}

@app.route("/mineGTCP", methods=["POST"])
@cross_origin(supports_credentials=True, origin='*')
def mineGTCP():
    data = json.loads(request.data)
    dataset = data["dataset"]
    # subgraph_algorithm = data["subgraph_algo"]
    # minsup = data["minsup"]
    minGTC=data["minGTC"]
    minGTPC=data["minGTPC"]
    maxOR=data["maxOR"]

    obj=gtc.GTCP("temp.txt",minGTC,minGTPC,maxOR);
    print("Mining")
    obj.mine();
    obj.writePatterns()
    js={}
    ind=1;
    for i in obj.L:

        dic={"Pattern (GID's)":i[0],"Pattern Coverage":i[1]}
        js.update({ind:dic})
        ind+=1
    
    dpath=os.path.join("Datasets",dataset+".txt")

    
    ob=gdb.graphDatabase(dpath)
    top10=[]
    req=[]
    patterns=[]
    for i in obj.L:
        if(len(patterns)>=3):
            break
        req.extend(i[0])
        patterns.append((i[0],i[1]))

    graphs=ob.getcomb(req)
    for pattern in patterns:
        imgs=[]
        for i in pattern[0]:
            imgs.append(graphs[i])
        top10.append((ob.plot_given(imgs,pattern[0]),pattern[1]))
    

    # top10.appen((ob.getcomb([2346,2633]),0.97))
    # top10.append((ob.getcomb([2345,2637]),0.95))

    print("mining done")
    with open('data.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
    return {"js":js,"images":top10}


    # return {"file_content": file_content,"subgraphs":image_url}

@app.route("/getPatterns", methods=["POST"])
@cross_origin(supports_credentials=True, origin='*')
def getPatterns():
    return jsonify(json.loads(request.form["arrayData"]))






if __name__ == "__main__":
    app.run(debug=True, port=5000)