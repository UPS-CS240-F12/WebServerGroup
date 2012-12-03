import json, urllib2

def changeState(data):
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))
    print json.load(response)

def getState():
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req)
    print json.load(response)
	
if __name__=="__main__":
    thisMessage = raw_input("Choose a message ")
    thisValue = raw_input("Choose a value ")
    data = {thisMessage : thisValue}
    changeState(data)
    #getState()
    #print "Hello World"
