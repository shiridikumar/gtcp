from typing import List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from PAMI.subgraphMining.basic import frequentSubgraph
from GTCP import GTCP
from PAMI.extras.stats import graphDatabase as gdb
from graph import graphDatabase

import gspan as gsp
import os
import json
from io import BytesIO
from contextlib import redirect_stdout
import base64
from fastapi.middleware.cors import CORSMiddleware

client = MongoClient('localhost', 27017)
db = client['gcp']
UPLOAD_FOLDER = 'Datasets'

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.mount("/static", StaticFiles(directory="static"), name="static")

class SubgraphMiningRequest(BaseModel):
    dataset: str
    subgraph_algo: str
    minsup: float


class GTCPRequest(BaseModel):
    dataset: str
    minGTC: float
    minGTPC: float
    maxOR: float

class PatternsRequest(BaseModel):
    arrayData: str

@app.post("/dataset_upload")
async def dataset_upload(file: UploadFile = File(...)):
    collection = db["datasets"]
    if not file.filename:
        raise HTTPException(status_code=400, detail="No selected file")
    
    file_metadata = {'file_name': file.filename}
    insert_result = collection.insert_one(file_metadata)
    file_id = str(insert_result.inserted_id)

    file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}.txt")
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return {"message": "File successfully uploaded", "file_id": file_id}

@app.get("/get_datasets_algos")
async def get_datasets_algos():
    files = []
    collection = db["datasets"]
    for doc in collection.find():
        files.append({'id': str(doc['_id']), 'file_name': doc['file_name'][:-4]})
    return {"datasets": files, "subgraph_algos": ["gSpan"], "pattern_algos": ["GTCP"]}



@app.post("/mineSubgraphs")
async def mine_subgraphs(request: SubgraphMiningRequest):
    dataset = request.dataset
    subgraph_algorithm = request.subgraph_algo
    minsup = request.minsup

    collections = db["datasets"]
    obj_id = ObjectId(dataset)
    doc = collections.find_one({"_id": obj_id})
    dpath = os.path.join(UPLOAD_FOLDER, f"{dataset}.txt")
    obj = gdb.graphDatabase(iFile=dpath)

    with open('stats.txt', 'w') as file:
        with redirect_stdout(file):
            obj.printGraphDatabaseStatistics()

    with open('stats.txt', 'r') as file:
        file_content = file.read().split("\n")

    obj = gsp.GSpan(dpath, minsup, False, float("inf"), False)
    print("Started mining -------------------------", minsup)
    obj.mine()
    obj.saveSubgraphsByGraphId("temp.txt")

    frequentGraphs = obj.getFrequentSubgraphs()
    memUSS = obj.getMemoryUSS()
    memRSS = obj.getMemoryRSS()
    run = obj.getRuntime()
    
    obj.save('frequentSupgraphs.txt')

    num = len(obj.frequentSubgraphs)
    image_url = "static/subgraphs.jpg"
    file_content.append(f"number of frequent graphs: {num}")
    print("done with mining -------------------------")

    return {"file_content": file_content, "subgraphs": image_url}

@app.post("/mineGTCP")
async def mine_gtcp(request: GTCPRequest):
    dataset = request.dataset
    minGTC = request.minGTC
    minGTPC = request.minGTPC
    maxOR = request.maxOR

    obj = GTCP("temp.txt", minGTC, minGTPC, maxOR)
    print("Started mining -------------------------", minGTC, minGTPC, maxOR)

    obj.mine()
    obj.writePatterns()

    js = {}
    ind = 1
    for i in obj.L:
        dic = {"Pattern (GID's)": i[0], "Pattern Coverage": i[1]}
        js.update({ind: dic})
        ind += 1

    dpath = os.path.join(UPLOAD_FOLDER, f"{dataset}.txt")
    ob = graphDatabase(dpath)
    top10 = []
    req = []
    patterns = []

    for i in obj.L:
        if len(patterns) >= 3:
            break
        req.extend(i[0])
        patterns.append((i[0], i[1]))

    graphs = ob.getcomb(req)
    for pattern in patterns:
        imgs = [graphs[i] for i in pattern[0]]
        top10.append((ob.plot_given(imgs, pattern[0]), pattern[1]))

    with open('data.json', 'w') as json_file:
        json.dump(request.dict(), json_file, indent=4)
    
    return {"js": js, "images": top10}

@app.post("/getPatterns")
async def get_patterns(request: PatternsRequest):
    return json.loads(request.arrayData)
