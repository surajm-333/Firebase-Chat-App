var userid = '';
var chatKey = '';
var friend_id = '';
document.addEventListener('DOMContentLoaded', function() 
{
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) 
            {
              
              userid = user.uid
              console.log(user)
              loaddata(userid)
              getlist()
              // console.log(userid)
              // document.getElementById('user').innerHTML += user.uid;
              // console.log("Last Login " + user.metadata.lastSignInTime)
              // document.getElementById('email').innerHTML+= user.email;
              document.getElementById('name').innerHTML+= user.displayName;
             
            } 
            else 
            {
              //
              window.location.href = "index.html";
              console.log("user is  not logged in")
            }
        });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        // firebase.analytics(); // call to activate
        // firebase.analytics().logEvent('tutorial_completed');
        // firebase.performance(); // call to activate
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        try {
          let app = firebase.app();
          let features = [
            'auth', 
            'database', 
            'messaging', 
            'storage', 
            'analytics', 
            'remoteConfig',
            'performance',
          ].filter(feature => typeof app[feature] === 'function');
          console.log(`Firebase SDK loaded with ${features.join(', ')}`);
        } catch (e) {
          console.error(e);
          console.log('Error loading the Firebase SDK, check the console.');
        }        
});
function out() 
{
  return firebase.auth().signOut();          
}
function loaddata(userid) 
{
  firebase.database().ref('users/'+ userid).on('value', snap => 
  {
    if (snap.exists()) 
      {
        console.log("Data Exists")
        console.log(snap.val())
         document.getElementById('myuname').innerHTML += snap.val().uname;
                  document.getElementById('mystatus').innerHTML += snap.val().status;
                   document.getElementById('img').src = snap.val().profile;
              // KEY
          //     snap.key
          // console.log(snap.key)    
          // //VALUE
          // //snap.val()
          // console.log(snap.val())
          // //snap.exists()
          // console.log(snap.exists())
          // //snap.numChildren()
          // console.log(snap.numChildren())
          // //snap.child()
          // // console.log(snap.child('Uid/email').val())
          // // console.log(snap.child('Uid').key)
          // //snap.hasChildren
          // console.log(snap.hasChildren())
          // console.log("FOR EACH LOOP STARTED BELOW")
          // snap.forEach(function(childsnap) 
          // {
          //   console.log(childsnap.key)
          //   console.log(childsnap.val())
          //   console.log(childsnap.val().Name)
          // })
      } 
      else 
      {
        console.log("Data Doesn't Exists")
        location.href = "register.html"
      } 
  });
}
function getlist() 
{
  firebase.database().ref("users/").on('value', snap => 
  {
    var list = ''
    snap.forEach(childsnap =>
    {
      console.log(childsnap.key)
      //document.getElementById('myuname').innerHTML = childsnap.val().uname;
      if (childsnap.key == userid) 
        {
          list+= ''
          //return;
        } 
        else 
        {     
          list +=
          `<li class="w3-padding-16" onclick="getid('${childsnap.key}','${childsnap.val().profile}','${childsnap.val().uname}','${childsnap.val().status}'); w3_close();" >
            <img src='${childsnap.val().profile}' class="w3-left w3-circle w3-margin-right" style="width:45px">
            <span class="w3-large">${childsnap.val().uname}</span><br>
            <span class="w3-small">${childsnap.val().status}</span><br>
          </li>` 
        }
    })
    document.getElementById('list').innerHTML = list;
    console.log(snap.val())
  })
}
function getid(id,pic,uname,status) 
{
  friend_id = id;
  console.log(friend_id)
  document.getElementById('hdrimg').src = pic;
  document.getElementById('hdrname').innerHTML = uname + " " + `<span class="w3-small w3-opacity">${status}</span>`;
  var friendList = { friendId: id, userId: userid };
    var db = firebase.database().ref('chatkeys');
    var flag = false;
    db.on('value', function (chkeys) 
    {
        chkeys.forEach(function (snap) 
        {
            var user = snap.val();
            // console.log(user)
            if ((user.friendId == friendList.friendId && user.userId == friendList.userId) || ((user.friendId == friendList.userId && user.userId == friendList.friendId))) 
            {
                flag = true;
                chatKey = snap.key;
                console.log(chatKey)
                loadMsg(chatKey,friend_id);
            }
        });
        if (flag == false) 
        {
            chatKey = firebase.database().ref('chatkeys').push(friendList, function (error) {
                if (error) alert(error);
            }).getKey();
            console.log(chatKey)
            loadMsg(chatKey,friend_id);
        }
        //loadMsg(chatKey,friendKey);
    });
} 
function sendMsg(ms,type,fname) 
{
  if(type === 'doc')
  {
    var filename = fname;
    var msgobj = 
    {
        uid: userid,
        msg: ms,
        type: type,
        fname: filename,
        timestamp: new Date().toLocaleString(),
      };
  }
  else
  {
    var msgobj = 
    {
        uid: userid,
        msg: ms,
        type: type,
        timestamp: new Date().toLocaleString(),
      };
  }
       firebase.database().ref('Messages').child(chatKey).push(msgobj, function (error) {
        if (error) alert(error);
        else 
        {   
            document.getElementById('sndmsg').value = '';
            document.getElementById('sndmsg').focus();
            loadMsg(chatKey,friend_id,filename);
        }
    });  
} 
function loadMsg(chtky,fkey,filename) 
{
  firebase.database().ref("Messages/").child(chtky).on('value', snap => 
  {
    var msgdisplay = ''
    snap.forEach(msgs => 
    {
        var chat = msgs.val()
        console.log(chat)
         var msg = '';
            if (chat.type === 'img') {
                msg = `<div><img src='${chat.msg}' class = "w3-image"/></div>`;
                // onclick="imgmodal('${chat.msg}')"
            }
            else if(chat.type === 'doc')
            {
              msg = `<div><strong><a href='${chat.msg}' class = "w3-image"/>${chat.fname}</a></strong></div>`;
            }
            else {
                msg = chat.msg;
            }
            if (chat.uid !== userid) {
                msgdisplay += `<div class="w3-display-container w3-light-grey">
                                      <span style="float:left;" onclick="mymodal('${chat.msg}','${chat.type}');"> <button>Forward</button></span>
                                     <div class="w3-left-align w3-panel w3-round-large" style=" margin-right:50%;background-color:#CACFCE;cursor:pointer">
                                    <span class="w3-text">${msg}</span><br>
                                    <span class="w3-small w3-opacity w3-right">${chat.timestamp}</span>
                                      </div>
                                   </div>`;
            }
            else {
                msgdisplay += `<div class="w3-display-container w3-light-grey" >
                                <span style="float:right;" onclick="deletemsg('${msgs.key}','${chat.msg}','${chat.type}')"> <button>Delete</button></span>
                                <span style="float:right;" onclick="mymodal('${chat.msg}','${chat.type}');"> <button>Forward</button></span>
                                     <div class="w3-right-align w3-panel w3-round-large" style="margin-left:50%; background-color: #18F5F1;cursor:pointer">
                                    <span class="w3-text">${msg}</span><br>
                                    <span class="w3-small w3-opacity w3-left">${chat.timestamp}</span>
                                      </div>
                                   </div>`;
            }

    })
    document.getElementById('msg').innerHTML = msgdisplay;
    window.scrollBy(0,document.getElementById('msg').scrollHeight);
  })
}
function deletemsg(id,msg,type)
{
  var deleteRef = firebase.database().ref("Messages/"+chatKey).child(id);
  if (type == 'img' || type == 'doc') 
   var storageRef = firebase.storage().refFromURL(msg)
  // alert(deleteRef)
  // alert(storageRef)
  var del = confirm("Delete the Message")
  if (del) 
  { 
    if (storageRef) 
      storageRef.delete()
    //DELETE LOGIC
    deleteRef.remove()
  }
  else
  {
    alert("Message is Not Deleted")
  }
}
function imgmodal(source) 
{
  document.getElementById('aaa').style.display='block';
  document.getElementById('imgmodal').src = source;
}
function mymodal(mss,type1)
{
  console.log(mss);
  console.log(type1);
  //console.log(chatKEY);
  document.getElementById('sss').style.display='block';
  //document.getElementById('experiment').innerHTML='asdf';
  firebase.database().ref("users/").on('value', snap => 
  {
    var list = ''
    snap.forEach(childsnap =>
    {
      console.log(childsnap.key)
      if (childsnap.key == userid) 
        {
          list+= ''
          //return;
        } 
        else 
        {
          // var ms = 1;
          // var type = 2;     
          list +=
          `<li class="w3-padding-16" onclick="getid('${childsnap.key}','${childsnap.val().profile}','${childsnap.val().uname}','${childsnap.val().status}')" >
            <img src='${childsnap.val().profile}' onclick="FwdMsg('${childsnap.key}','${mss}','${type1}')" class="w3-left w3-circle w3-margin-right" style="width:45px">
            <span class="w3-large">${childsnap.val().uname}</span><br>
            <span class="w3-small">${childsnap.val().status}</span><br>
          </li><hr>` 
        }
    })
    document.getElementById('experiment').innerHTML =  `<h2 align="center"> Forward To, </h2><hr/>` + list;
    console.log(snap.val())
  })
}

function FwdMsg(id,mss,type1)
{
  //alert('hello')

  friend_id = id;
  console.log(friend_id)
  // document.getElementById('hdrimg').src = pic;
  // document.getElementById('hdrname').innerHTML = uname + " " + `<span class="w3-small w3-opacity">${status}</span>`;
  var friendList = { friendId: id, userId: userid };
    var db = firebase.database().ref('chatkeys');
    var flag = false;
    db.on('value', function (chkeys) 
    {
        chkeys.forEach(function (snap) 
        {
            var user = snap.val();
            // console.log(user)
            if ((user.friendId == friendList.friendId && user.userId == friendList.userId) || ((user.friendId == friendList.userId && user.userId == friendList.friendId))) 
            {
                flag = true;
                chatKey = snap.key;
                console.log(chatKey)
                //loadMsg(chatKey,friend_id);
            }
        });
        if (flag == false) 
        {
            chatKey = firebase.database().ref('chatkeys').push(friendList, function (error) {
                if (error) alert(error);
            }).getKey();
            console.log(chatKey)
            //loadMsg(chatKey,friend_id);
        }
        //loadMsg(chatKey,friendKey);
    });

  var msobject = 
    {
      uid: userid,
      msg: mss,
      type: type1,
      timestamp: new Date().toLocaleString(),
    };
    
       firebase.database().ref('Messages').child(chatKey).push(msobject, function (error) {
        if (error) alert(error);
        else 
        {   
            document.getElementById('sndmsg').value = '';
            document.getElementById('sndmsg').focus();
            //loadMsg(chatKey,friend_id);
        }
    });
}

// function info()
// {
//   firebase.database().ref("users/").on('value', snap => 
//   {
//     snap.forEach(childsnap =>
//     {
//       console.log(childsnap.key)
      
//           document.getElementById('uname1').innerHTML+= childsnap.value().uname;
//           document.getElementById('status1').innerHTML += childsnap.value().status; 
//     })
//   });
// }

function sendFile(fl) 
{
  var file = fl.files[0];
  var ftime = ("CodersClub"+new Date().getTime()); 
  console.log(file)
  console.log(ftime)
  var upload = firebase.storage().ref("File/"+ chatKey).child(ftime).put(file);
  upload.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    upload.snapshot.ref.getDownloadURL().then(function(downloadURL) 
    {
      console.log('File available at', downloadURL);
      // STORING URL
      sendMsg(downloadURL,'img');
      // var msgobj = 
      // {
      //   uid: userid,
      //   msg: downloadURL,
      //   type: 'img',
      //   timestamp: new Date().toLocaleString(),
      // };
      // firebase.database().ref('Messages').child(chatKey).push(msgobj, function (error) {
      //   if (error) alert(error);
      //   else 
      //   {   
      //       document.getElementById('sndmsg').value = '';
      //       document.getElementById('sndmsg').focus();
      //       loadMsg(chatKey,friendKey);  
      //   }
      // });
      // STORING URL
    });
  });
}
function sendDoc(fl)
{
    var file = fl.files[0];
    var fname = file.name;
    console.log(fname);
  var ftime = ("Doc"+new Date().getTime()); 
  console.log(file)
  console.log(ftime)
  var upload = firebase.storage().ref("Documnets/"+ chatKey).child(ftime).put(file);
  upload.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    upload.snapshot.ref.getDownloadURL().then(function(downloadURL) 
    {
      console.log('File available at', downloadURL);
      // STORING URL
      sendMsg(downloadURL,'doc',fname);
    });
  });
}

// function updateDP(dp)
// {
//   console.log('working it is')
//     // var file = dp.files[0];
//     // console.log(file);
//     // firebase.database().ref("users/"+ userid).on('value',snap=>
//     //   {
//     //       snap.val().profile = file.name;            
//     //   });
// } 

function dark()
{
  //alert('dark')
  var element = document.body;
  element.classList.toggle("dark-mode");
}
//ENTER KEY SEND MESSAGE
document.addEventListener('keydown', function (key) {
    if (key.which == 13) 
    {
      var ms = document.getElementById('sndmsg').value;
      if (ms == "") 
          alert("Message Can't Be Empty")
        else
          sendMsg(ms,'text');
    }
});