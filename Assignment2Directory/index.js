const check = () => {
	if (!('serviceWorker' in navigator)) {
	  throw new Error('No Service Worker support!')
	}
	if (!('PushManager' in window)) {
	  throw new Error('No Push API Support!')
	}
}
// // I added a function that can be used to register a service worker.
const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('/public/service-worker.js'); //notice the file name
    return swRegistration;
}

const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body,
        // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);
}

const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if(permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    }
}
const main = async () => {
    check();
	const permission =  await requestNotificationPermission();
    const swRegistration = await registerServiceWorker();
	// showLocalNotification('CS6313 Title of the message', 'CS6313 Assignment 2 Task 2 message', swRegistration);
}
// const main = async () => { //notice I changed main to async function so that I can use await for registerServiceWorker
//     check();
//     const swRegistration = await registerServiceWorker();
// }

// main()

var listOfServicesRequest = new XMLHttpRequest();

listOfServicesRequest.onreadystatechange = function(){
    if (listOfServicesRequest.readyState === 4){
        var listOfServices = JSON.parse(listOfServicesRequest.responseText);
		// console.log("List of services: ", JSON.stringify(listOfServices))
		var list = document.getElementById('serviceList');
        for (var i=0; i<listOfServices.length; i++){
			var div = document.createElement("DIV")
            var dt = document.createElement('dt');
			var ita = document.createElement('I');
			var anchor = document.createElement('A');
			var textNode = document.createTextNode(listOfServices[i].name);
			anchor.setAttribute("href", listOfServices[i].location);
			anchor.appendChild(textNode);
			ita.appendChild(anchor);
			dt.appendChild(anchor);
			var dd1 = document.createElement('dd');
			var by = document.createTextNode('- by ' + listOfServices[i].serviceProvider);
			dd1.appendChild(by)
			dt.appendChild(dd1);
			var dd2 = document.createElement('dd');
			var desc = document.createTextNode(listOfServices[i].description);
			dd2.appendChild(desc)
			dt.appendChild(dd2)
			var dd3 = document.createElement('dd');
			var date = new Date(listOfServices[i].serviceAddedTime).toString();
			dd3.appendChild(document.createTextNode('Service added at:' + date))
			dt.appendChild(dd3)
			var newline = document.createElement('br')
			var button = document.createElement("BUTTON");
			button.id = listOfServices[i]._id
			button.className = "subscribeNotiButton"
			var buttonText = document.createTextNode("Subscribe");
			button.appendChild(buttonText);
			button.appendChild(newline);
			dt.appendChild(button)
			dt.appendChild(newline)
			div.appendChild(dt)
			list.appendChild(div);
        }
    }
};

listOfServicesRequest.open('GET', '/service');
listOfServicesRequest.send();

function searchFunc() {
	var input, filter, a, i, txtValue;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	dl = document.getElementById("serviceList");
	dt = dl.getElementsByTagName("div");
	for (i = 0; i < dt.length; i++) {
		a = dt[i].getElementsByTagName("a")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			dt[i].style.display = "";
		} else {
			dt[i].style.display = "none";
		}
	}
}

$(document).on('click', '.subscribeNotiButton', function(){
    subscribe($(this).attr('id'))
});

async function subscribe(id){
	console.log("Subscribing service with id: ", id)
	main()
}