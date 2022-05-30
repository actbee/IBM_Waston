from flask import Flask, json, request, jsonify
import requests as rs
from flask_cors import CORS


def fetchObjects(image):    
    request_url = "https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient"
    img = image
    params = {"image":img}
    access_token = "24.26991ed61b147d86961d1d69eb8daaad.2592000.1655767051.282335-26287716"
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = rs.post(request_url, data=params, headers=headers)
    if response:
        print (response.json())
    return response.json()
api = Flask(__name__)
CORS(api)


@api.route('/objects', methods=['POST'])
def get_objects():
    print(request.form)
    image = request.form.get('image')
    res = fetchObjects(image)
   
    del res['log_id']
   
    return jsonify(res), 201
if __name__ == '__main__':
    api.run() 