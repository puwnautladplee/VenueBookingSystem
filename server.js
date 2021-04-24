
const express = require('express')
var fs = require('fs');
const app = express()
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
 
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/lib', express.static('public/lib'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.html');
})
app.get('/demo-booking-data.json', (req, res) => {
  res.sendFile(__dirname + '/demo-booking-data.json');
})
app.post('/addBooking', (req, res) =>{
  fs.readFile('demo-booking-data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now it an object
      console.log(obj.length,req.body);
      obj.push({
        id: (obj.length+1), 
        "roomId": req.body.roomId,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime,
        "title": req.body.title
      }); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('demo-booking-data.json', json, function(err) {
        if (err) throw err;
        console.log('completes');
        res.send("complete");
      }
      ); // write it back 
  }});
})

app.get('/bookinngs/:type', (req, res) => {
  res.render(__dirname + '/views/bookings.html',{type:req.params.type,roomId:req.query.roomId});
})
app.listen(3000, 'localhost')