function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}

const getBooking = async (roomId, type) =>{
 var dataBooking = {today:[],thisweek:[],nextweek:[],wholemonth:[]} ;
 var dateCurrent = moment().format('YYYY-MM-DD');  
 var monthCurrent = moment().format('MM');  
 var startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
 var endOfWeek   = moment().endOf('week').format('YYYY-MM-DD');
 var startOfNextWeek =moment().add(1, 'weeks').startOf('week').format('YYYY-MM-DD');
 var endOfNextWeek =moment().add(1, 'weeks').endOf('week').format('YYYY-MM-DD');
 var dataThsiweek = [] ;
 await fetch('/demo-booking-data.json')
    .then(response => response.json())
    .then(data =>{
     data.filter(function (r) { 
      let date = moment(r.startTime).format('YYYY-MM-DD');
      let month = moment(r.startTime).format('MM'); 
      if(r.roomId === roomId){
       if(date == dateCurrent) dataBooking.today.push(r) ;
       if(toTimestamp(date) >= toTimestamp(dateCurrent) && toTimestamp(date) >= toTimestamp(startOfWeek) && toTimestamp(date) <= toTimestamp(endOfWeek)){
        dataBooking.thisweek.push(r) ;
       }
       if(toTimestamp(date) >= toTimestamp(startOfNextWeek) && toTimestamp(date) <= toTimestamp(endOfNextWeek)){
        dataBooking.nextweek.push(r) ;
       }
       if(month == monthCurrent){
        dataBooking.wholemonth.push(r) ;
       }
      }
     })
     
    });
    console.log(dataBooking);
 return dataBooking ;
}

const setToday = (obj) =>{
 var innerHTML = `
 <div class="roomnumber"><h1 class="titleroom">${roomId}</h1></div>
     <p class="txtp">Upcoming</p>
     <p class="txtday">${moment().format('dddd')}</p>
     <p class="txtdate">${moment().format('DD MMM')}</p>
     <div class="boxlistdetailtoday">
       <ul class="listdetailtoday p-0">
 `;
   if(obj.length){
    $.each(obj, function (i, v) { 
     let startTime = moment(v.startTime).format('hh:mm');  
     let endTime = moment(v.endTime).format('hh:mm');  
      innerHTML += `
      <li>
        <p class="txttime">${startTime} - ${endTime}</p>
        <p class="txttitle">${v.title}</p>
      </li>
      `;
    });
   }else{
    // innerHTML += `
    //  <li>
    //   <p class="txttitle">No event !</p>
    //  </li>
    // ` ;
   }
     innerHTML+= `
      </ul>
     </div>
     `
 $('#boxToday').html(innerHTML);
}
//JS
const arrClassColor = ["point1","point2","point3"] ;
var index = 0 ;
const setthisweek = (obj) => {
 var innerHTML = `<div class="timeline">`;
 if(obj.length){
  obj.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
  var dataGroupDay = []
  $.each(obj, function (i, v) { 
   let date = moment(v.startTime).format('YYYY-MM-DD') ;
   if($.inArray(date, dataGroupDay) === -1){
    index = 0 ;
    if(i) innerHTML += `</ul>`;
     dataGroupDay.push(date) ;
     innerHTML+= `
     <div class="titletimeline">${moment(date).calendar().split(" at")[0]} (${moment(date).format("dd, DD MMM")})</div>
     <ul class="listtimeline">
     `;
   }
   let startTime = moment(v.startTime).format('HH:mm');  
   let endTime = moment(v.endTime).format('HH:mm');  
   innerHTML += `
   <li>
     <div class="detailevent">
       <div class="wrapper">
         <div class="point ${arrClassColor[index%3]}">
         <p class="txttime">${startTime} - ${endTime}</p>
         <p class="txttitle">${v.title}</p>
         </div>
       </div>
     </div>
   </li>
   `;
   index++;
  });
  innerHTML += `</div>`;
 }else{
  innerHTML = `<div class="no-event">No Event !</div>`
 }
 $('.boxlistdetails').html(innerHTML);
}

const setnextweek = (obj) => {
 var innerHTML = `<div class="timeline">`;
 if(obj.length){
  obj.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
  var dataGroupDay = []
  $.each(obj, function (i, v) { 
   let date = moment(v.startTime).format('YYYY-MM-DD') ;
   if($.inArray(date, dataGroupDay) === -1){
    index = 0 ;
    if(i) innerHTML += `</ul>`;
     dataGroupDay.push(date) ;
     innerHTML+= `
     <div class="titletimeline">${moment(date).format("dddd, DD MMMM")}</div>
     <ul class="listtimeline">
     `;
   }
   let startTime = moment(v.startTime).format('HH:mm');  
   let endTime = moment(v.endTime).format('HH:mm');  
   innerHTML += `
   <li>
     <div class="detailevent">
       <div class="wrapper">
         <div class="point ${arrClassColor[index%3]}">
         <p class="txttime">${startTime} - ${endTime}</p>
         <p class="txttitle">${v.title}</p>
         </div>
       </div>
     </div>
   </li>
   `;
   index++;
  });
  innerHTML += `</div>`;
 }else{
  innerHTML = `<div class="no-event">No Event !</div>`
 }
 
 $('.boxlistdetails').html(innerHTML);
}

const setwholemonth = (obj) => {
 var innerHTML = `<div class="timeline">`;
 if(obj.length){
  obj.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
  var dataGroupDay = []
  $.each(obj, function (i, v) { 
   let date = moment(v.startTime).format('YYYY-MM-DD') ;
   if($.inArray(date, dataGroupDay) === -1){
    index= 0;
    if(i) innerHTML += `</ul>`;
     dataGroupDay.push(date) ;
     innerHTML+= `
     <div class="titletimeline">${moment(date).format("dddd, DD MMMM")}</div>
     <ul class="listtimeline">
     `;
   }
   let startTime = moment(v.startTime).format('HH:mm');  
   let endTime = moment(v.endTime).format('HH:mm');  
   innerHTML += `
   <li>
     <div class="detailevent">
       <div class="wrapper">
         <div class="point ${arrClassColor[index%3]}">
         <p class="txttime">${startTime} - ${endTime}</p>
         <p class="txttitle">${v.title}</p>
         </div>
       </div>
     </div>
   </li>
   `;
   index++;
  });
  innerHTML += `</div>`;
 }else{
  innerHTML = `<div class="no-event">No Event !</div>`
 }
 
 $('.boxlistdetails').html(innerHTML);
}
$(document).ready(async function () {
 var obj = await getBooking(roomId,type);
 setToday(obj.today);
 if(type == 'thisweek'){
  setthisweek(obj.thisweek) ;
 }else if(type == 'nextweek'){
  setnextweek(obj.nextweek) ;
 }else if(type == 'wholemonth'){
  setwholemonth(obj.wholemonth) ;
 }
});