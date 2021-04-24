$(document).ready(function () {
 $('#datepicker1, #datepicker2').datepicker({
  dateFormat: 'yy-mm-dd'
 })
 $('#timepickerStart, #timepickerEnd').timepicker({
  timeFormat:"HH:mm:ss",  
  pickerTimeFormat:"HH:mm",
  showSecond:false
 })
});

function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}

$("#datepicker1, #datepicker2").change(function (e) { 
 e.preventDefault();
 $(".txtalert").remove();
 if(toTimestamp($('#datepicker1').val()) > toTimestamp($('#datepicker2').val())){
  $('#datepicker2').after("<span class='txtalert'>Please select a valid date.</span>")
 }
});
$("#timepickerStart, #timepickerEnd").change(function (e) { 
 e.preventDefault();
 $(".txtalert").remove();
 if(toTimestamp($('#datepicker1').val()+" "+$('#timepickerStart').val()) > toTimestamp($('#datepicker2').val()+" "+$('#timepickerEnd').val()) && $('#timepickerEnd').val()){
  $('#timepickerEnd').after("<span class='txtalert'>Please select a valid time.</span>")
 }
});
$('#roomID').keyup(function (e) { 
 e.preventDefault();
 if(this.value) $(".txtalert").remove();
});
const checkAvailability = async (roomId, startTime, endTime) =>{
 var dataRoom = [] ;
 await fetch('/demo-booking-data.json')
    .then(response => response.json())
    .then(data =>{
     dataRoom = data.filter(function (r) { 
      if(r.roomId == roomId &&
       (toTimestamp(startTime) >= toTimestamp(r.startTime) && toTimestamp(startTime) < toTimestamp(r.endTime) ||
       toTimestamp(endTime) > toTimestamp(r.startTime) && toTimestamp(endTime) <= toTimestamp(r.endTime) ||
       toTimestamp(startTime) < toTimestamp(r.endTime) && toTimestamp(endTime) >= toTimestamp(r.endTime))){
        return r
       }
     })
    });
 return dataRoom ;
}
const booking = () => {
 let room = $('#roomID')
 $(".txtalert").remove();
 if(!room.val()){
  room.after("<span class='txtalert'>Please input room number</span>")
 }else if(room.val() < 100 || room.val() > 110){
  room.after("<span class='txtalert'>Please input room number 101-110</span>")
 }else if(!$('#title').val()){
  $('#title').after("<span class='txtalert'>Please input title</span>")
 }else if(!$('#datepicker1').val() || !$('#datepicker2').val()){
  $('#datepicker2').after("<span class='txtalert'>Please select date start and end</span>")
 }else if(!$('#timepickerStart').val() || !$('#timepickerEnd').val()){
  $('#timepickerEnd').after("<span class='txtalert'>Please select time start and end</span>")
 }else if(toTimestamp($('#datepicker1').val()) > toTimestamp($('#datepicker2').val())){
  $('#datepicker2').after("<span class='txtalert'>Please select a valid date.</span>")
 }else if(toTimestamp($('#timepickerStart').val()) > toTimestamp($('#timepickerEnd').val())){
  $('#timepickerEnd').after("<span class='txtalert'>Please select a valid time.</span>")
 }else{
  saveBooking() ;
 }
}

const saveBooking = () => {  
 let roomID = "A"+$('#roomID').val() ;
 let title = $('#title').val() ;
 let startTime = $('#datepicker1').val()+" "+$('#timepickerStart').val()
 let endTime = $('#datepicker2').val()+" "+$('#timepickerEnd').val()
 checkAvailability(roomID,startTime,endTime).then((result) => {
  console.log(result);
  if(!result.length){
   fetch('/addBooking', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         "roomId": roomID,
         "startTime": startTime,
         "endTime": endTime,
         "title": title
       })
   }).then((result) => {
    console.log(result);
    if(result.status === 200){
     Swal.fire({
      icon: 'success',
      title: 'Booking Success',
      showConfirmButton: false,
      timer: 2000
    }).then((result) => {
     window.location.reload();
   })
    
    }
   }).catch((err) => {
    console.log(err);
   });
  }else{
   Swal.fire({
    icon: 'warning',
    html: `Room ${roomID+" date "+startTime+" To "+endTime} does not have any available rooms.`,
    showConfirmButton: false,
  })
  }
 }).catch((err) => {
  console.log(err);
 });
}



const checkDetail = () =>{
  let room = $('#roomID')
  $(".txtalert").remove();
  if(!room.val()){
   room.after("<span class='txtalert'>Please input room number</span>")
  }else if(room.val() < 100 || room.val() > 110){
    room.after("<span class='txtalert'>Please input room number 101-110</span>")
  }else{
    window.location.href = "/bookinngs/thisweek?roomId="+"A"+room.val() ;
  }
}