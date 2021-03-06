// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  // saveSubscription saves the subscription to the backend
  const saveSubscription = async subscription => {
    const SERVER_URL = 'http://localhost:3000/endPoint'
    const response = await fetch(SERVER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
  }
  self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.
    try {
      const applicationServerKey = urlB64ToUint8Array(
        'BNYBeiK2Obko6wU6MKyLd7kZjBrE9Usbn4ow7tjdKInFm8lgvHiD5VPtvY2ZJbM1YGzjlb4SZamTvi194ZgcZD4'
      )
      const options = { applicationServerKey, userVisibleOnly: true }
      const subscription = await self.registration.pushManager.subscribe(options)
      const response = await saveSubscription(subscription)
      console.log(response)
    } catch (err) {
      console.log('Error', err)
    }
  })

  //Listen to the push event from the back end
  self.addEventListener('push', function(event) {
    if (event.data) {
      var mes = JSON.parse(event.data.text())
      console.log("Push event!! ", mes.title);
        showLocalNotification(mes.title, mes.message,  self.registration);
      } else {
        console.log("Push event but no data");
      }
  })

  const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body
      // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);
  };