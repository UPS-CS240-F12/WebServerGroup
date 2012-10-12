import json, urllib2

def changeState(data):
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))
    
if __name__=="__main__":
    data = {'message' : "changed the message!"}
    changeState(data)