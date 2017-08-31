var express = require('express');
var router = express.Router();
var request = require('request-promise');

/* GET index page. */

router.use(function(req,res,next){
  // console.log('index.html from router - index.js');
  next();
});

router.get('/', function(req, res, next) {
console.log("index");  
res.sendFile('index.html');
});
router.get('/getAdaValuesCol1',function(req,res){
console.log("col1 router");
      request({
                   headers: {
                       'Content-Type': 'application/json',
                       'x-aio-key': "2880ecd4b0c447f8b2eb25c704490f61"
},
   uri: 'https://io.adafruit.com/api/v2/'+ 'MSLaser' + '/feeds/' + 'co1'+ '/data',
method: 'GET',
       json: true
}).then(data => {
var result = [];
var j = data.length - 300;

for(i=j; i < data.length;i++)
{
 values = { "time":data[i].created_at , "value":data[i].value };

result.push(values);
}

var c=1;
var mean = [];
var std = [];
var dummy = [];
var sum=0;
var x=0;
var i=0, k=0; 
while(i<result.length)
{
	if(result[k].value < 30)
	{
		c++;

	}
	k=i;
 	for (j=0; j< result.length ; j++)
 		{
			//console.log(result[k]+" - "+k);
			dummy[j]=result[k].value;
			if( result[k].value<30)
				{
					i=k;
					break;
				}
			if( k == (result.length-1))
				{
					break;
				}
			else
				k++;
		}
	sum=0;
	for (j=0; j<dummy.length ; j++)
		{
sum = sum + parseInt(dummy[j]);	
//console.log(sum);
//console.log(dummy[j]);
}	
	
	//console.log(dummy+"ccccc");
	mean[x] = sum/dummy.length;
	//console.log(c);
	sum=0;
	for (j=0; j<dummy.length; j++)
		sum+=((dummy[j]-mean[x])*(dummy[j]-mean[x]));
	std[x] = Math.sqrt(sum/dummy.length);
	x++;
	i=k+1;
}

sum=0;
for(i=0; i<mean.length; i++)
	sum = sum + parseInt(mean[i]);

var ovrmean;

ovrmean = sum/mean.length;
sum=0;
for(i=0;i<std.length;i++)
	sum+=((std[i]-ovrmean)*(std[i]-ovrmean));

var ovrstd;

ovrstd = Math.sqrt(sum/std.length);

var ovrthresh, warn = 0;

ovrthresh = ovrmean + (ovrstd);
i=0;
j=1;
while(i<result.length)
{
	if((result[i].value > ovrthresh)&&(j==1))
	{
		warn++;
		j=0;
	}
 	if(result[i].value<30)
		j=1;
	i++;
}	
		
console.log(ovrmean+"blahblah"+ovrstd);

var dataAll ={
"result": result,
"mean": ovrmean,
"threshhold": ovrthresh,
"warning": warn,
"count": c

};
res.send(dataAll);
console.log("bb"+mean+"ccc"+std+"ddd"+c+" No. of warnings: "+warn);

var dumb = 200;
setInterval(function(){
console.log("col1 router");
      request({
                   headers: {
                       'Content-Type': 'application/json',
                       'x-aio-key': "2880ecd4b0c447f8b2eb25c704490f61"
},
   uri: 'https://io.adafruit.com/api/v2/'+ 'MSLaser' + '/feeds/' + 'co1'+ '/data',
method: 'GET',
       json: true
}).then(data => {
var result = [];
var j = data.length - 1; 

values = { "time":data[j].created_at , "value":data[j].value };

result.push(values);

if(result[0].value > dumb)
	{
		console.log("FIRE");
		// Twilio Credentials
		conountSid = 'AC2afce28ef667457d0f2b189257fa94ef';
		const authToken = 'e885fc2760ad02d353cf971107d211c0';
		// require the Twilio module and create a REST client
		const client = require('twilio')(accountSid, authToken);
		client.messages
 		.create({
   		to: '+4915214301194',
   		from: '+16308830128',
   		body: "Fire alert",
 		})
 		.then((message) => console.log(message.sid)); 
		dumb = 200;
	}

});
//res.redirect("index.html");
},6000);
});
});
module.exports = router;
