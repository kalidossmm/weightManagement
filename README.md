# weightManagement
To Store and retrieve the human body weight


Two methods are available,

1) GET Method,
URL: 
   http://localhost/users/{userId}/weights

Summary: 
    Weights

Description: 
	To retrive the weight(s) information. Since the weight can be collected from the machine(ble connection) and can send batch of weights too, So this api accept array of weights.

Parameters:
	Name: 	userId	
	Located:  	path	
	Description: user unique id
	Required: 	Yes	
	Type: 		string

	Name: 		startDate
	Located: 	query	
	Description: Strating date user want to retrive the weight information.
	Required: 	No	
	Type: 		string (date)

	Name: 		endDate
	Located: 	query	
	Description: Ending date user want to retrive the weight information.
	Required: 	No	
	Type: 		string (date)

Response: 