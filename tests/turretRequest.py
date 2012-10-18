import json, urllib2

def changeState(data):
    req = urllib2.Request('http://localhost:4242/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))

def getState():
    req = urllib2.Request('http://localhost:4242/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req)
    print json.load(response)
	
    
turretPos = raw_input("Turret location? Format should be 'x,y,z' (without quotes): ")
if __name__=="__main__":
    data = {'turret':{'ID' : '1', 'position' : turretPos}}
    changeState(data)
    getState()
    #print "Hello World"
