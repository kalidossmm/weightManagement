# weightManagement
To Store and retrieve the human body weight


# Two methods are available,

## GET Method,
URL: 
-  http://localhost/users/{userId}/weights

Summary: 
-   Weights

Description: 
-   To retrive the weight(s) information. By Default it will give last 10 days of data. (Which is configurable).

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
```json
{
	"data": [{
		"weight": "10.2",
		"date": "2016-12-31T10:10:10Z"
	}, {
		"weight": "22.2",
		"date": "2016-12-30T10:10:10Z"
	}, {
		"weight": "10.2",
		"date": "2016-12-29T10:10:10Z"
	}],
	"aggregation": {
		"minWeight": 12.3,
		"maxWeight": 24.6,
		"averageWeight": 17,
		"changeInWeight": 12.0,
		"dateofMaxWeight": "2016-12-30T10:10:10Z",
		"dateofMinweight": "2016-12-31T10:10:10Z",
		"count": 12
	}
}
```

## POST Method,
URL: 
-   http://localhost/users/{userId}/weights

Summary: 
-   Add Weights

Description: 
-   To store the weight(s) information. Since the weight can be collected from the machine(ble connection) and can send batch of weights too, So this api accept array of weights.

Parameters:

	Name: 	userId	
	Located:  	path	
	Description: user unique id
	Required: 	Yes	
	Type: 		string
	
Request: 
~~~json
[{
	"weight": "10.2",
	"date": "2016-12-31T10:10:10Z"
}, {
	"weight": "22.2",
	"date": "2016-12-30T10:10:10Z"
}, {
	"weight": "10.2",
	"date": "2016-12-29T10:10:10Z"
}]
~~~

Response: 
- Http Response code: 201
