import json, urllib2

def changeState(data):
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))

def getState():
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req)
    print json.load(response)
	
    
thisMessage = raw_input("Choose a message ")
if __name__=="__main__":
    data = {'message' : thisMessage}
    changeState(data)
    getState()
    #print "Hello World"