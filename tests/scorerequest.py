import json, urllib2

def getState():
    req = urllib2.Request('http://localhost:1730/phoneSim.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req)
    print json.load(response)
    

if __name__=="__main__":
    phone = raw_input("Choose a phone ")
    score = raw_input("Choose a score delta ")
    data = {}
    req = urllib2.Request('http://localhost:1730/phoneSim.json?phone=%s&score=%s' % (phone, score),json.dumps(data))
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req)
    getState()
    #print "Hello World"
