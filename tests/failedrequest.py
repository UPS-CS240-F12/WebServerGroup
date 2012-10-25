#This guy tests sending broken JSON data.
import json, urllib2

def failedState():
    req = urllib2.Request('http://localhost:1730/gameState.json')
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, "this is not json data")
    return response
	
if __name__=="__main__":
    try:
        x = failedState()
    except urllib2.HTTPError as e:
        assert str(e) == "HTTP Error 400: Bad Request"
        print e
