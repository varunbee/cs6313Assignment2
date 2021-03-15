var CronJob = require('cron').CronJob;
const serviceModel = require('../app/models/service.model.js');

//Every hour
var updateCurrency = new CronJob('1 * * * * *', function() {
    //console.log("CRON run.")
    serviceModel.find({"active": true})
    .then(services => {
        for (var i=0; i<services.length; i++) {
            leaseTime = services[i].leaseDuration
            //console.log((services[i].serviceAddedTime + leaseTime) + " and now: " + new Date().getTime())
            if(leaseTime>0){
              if((services[i].serviceAddedTime + leaseTime)  <= new Date().getTime()){
               // console.log("Found service that needs to be expired.")
                serviceModel.findByIdAndUpdate({_id: services[i]._id},{
                  "active":false
                })
                .then(service => {
                    if(service) {
                      console.log("Service: " + service.name + " has been expired.")
                    }
                }).catch(err => {
                    //Suppressed
                });
              }
            }
        }
    }).catch(err => {
      //Suppressed
    });
}, null, true, 'Europe/Dublin');

module.exports ={
  serviceValidityChecker: updateCurrency
}