var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});

router.get('/index-gpoc', function (req, res) {
  req.session.destroy();
  res.render('index-gpoc.html');
});

module.exports = router

// Example primary service +++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/primary-service', function(req, res) {
  res.render('triage-end-phase/primary-service.html', {
    callToAction : 'Get help as soon as you can.',
    callToActionLevel : 'callout--warning',
    preamble : '',
    name : 'Leeds General Infirmary',
    important : '',
    postscript : '',
    address : 'Emergency Department<br>Great George Street<br>Leeds<br>West Yorkshire<br>LS1 3EX',
    openingTimes : '<p>Open 24 hours</p>',
    distance : '0.1 miles',
    lat : '53.801732',
    long : '-1.551858',
    moreServicesLink : '/service-list/multiple-service-offering-leeds',
    careAdvice : '<div class="care-advice-output"><details><summary><span>Breathlessness</span></summary> <div> <ul> <li> Sit as upright as is comfortable. </li> <li> If an inhaler or a spacer is used for chest problems, follow the instructions about &quot;what to do if your breathing gets worse&quot;. </li> <li> Never use medicines which have been prescribed for someone else. </li> </ul> </div> </details> <details> <summary><span>Medication, pain and/or fever</span></summary> <div> <ul> <li> Paracetamol or ibuprofen can be used to relieve pain or a fever. Don’t take if you’ve been told not to, or you’ve already taken some. Read the instructions on the packet, or talk to a pharmacist. </li> </ul> </div> </details> <details> <summary><span>Headache</span></summary> <div> <ul> <li> A heated pad or covered hot water bottle on the back of your neck may help ease the pain. </li> <li> Call 999 if: <ul> <li> The person becomes very drowsy, isn’t responding normally or is having a fit. </li> <li> The person becomes severely ill with new marks under the skin which look like bruising or bleeding. </li> </ul> </li> </ul> </div> </details></div>'
  });
});

// Postcode ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/clinical-callback', function (req, res) {
  res.render('clinical-callback/clinical-callback', {
    session: req.session
  });
});

router.post('/clinical-callback/clinical-callback', function (req, res) {

  if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.postcode = req.body['postcode'];
  req.session.homeAddress.building = req.body['building'];

  if (req.body['postcode'] === '') {
    res.render('clinical-callback/clinical-callback', {
      session: req.session,
      error: {
        general: 'A valid postcode is required to book a phone call',
        postcode: 'Please enter a postcode'
      }
    });
  } else {

    res.redirect('details_2');
  }
})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Postcode ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/clinical-callback', function (req, res) {
  res.render('clinical-callback/mp-clinical-callback', {
    session: req.session
  });

});

router.post('/clinical-callback/mp-clinical-callback', function (req, res) {

  if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.postcode = req.body['postcode'];
  req.session.homeAddress.building = req.body['building'];

  if (req.body['postcode'] === '') {
    res.render('clinical-callback/mp-clinical-callback', {
      session: req.session,
      error: {
        general: 'A valid postcode is required to book a phone call',
        postcode: 'Please enter a postcode'
      }
    });
  } else {
    res.redirect('mp-details_who');
  }
})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Which person +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-details_who', function (req, res) {

    if (!req.session.pronoun) {
        req.session.pronoun = {}
    }

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    if (!req.session.informant) {
        req.session.informant = {}
    }

    if (req.body['check-person'] == "self") {
        //capture pateints name data
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
        req.session.pronoun = 'your';

        res.redirect('mp-telephone');

        // //check the form is filled correctly
        // if (req.body['self-first-name'] === '' && req.body['self-last-name'] === '') {
        //   res.render('clinical-callback/mp-details_who', {
        //     session: req.session,
        //     error: {
        //       general: 'Please enter a name'
        //     }
        //   });
        // } else {
        //   // go to details
        //   res.redirect('mp-details');
        // }

    } else if (req.body['check-person'] == "other"){
        //capture pateints name data
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];

        //capture informant data - this details of someone to speak to.
        req.session.informant.firstName = req.body['informant-first-name'];
        req.session.informant.lastName = req.body['informant-last-name'];

        req.session.pronoun = 'their';

        // go to details
        res.redirect('mp-telephone');

    } else {

        res.render('clinical-callback/mp-details_who', {
          session: req.session,
          error: {
            general: 'Please select who the service is for'
          }
        });

      }
})


// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set telephone +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


router.post('/clinical-callback/mp-telephone', function (req, res) {

    if (!req.session.telephoneNumber) {
      req.session.telephoneNumber = {}
    }

    if (!req.session.editElement) {
      req.session.editElement = {}
    }

    req.session.telephoneNumber = req.body['tel-number'];

    if (!req.body['tel-number']) {
      res.render('clinical-callback/mp-telephone', {
          session: req.session,
          error: {
            general: 'A phone number is required to book a call',
            telephone: 'Please enter a phone number',
          }
      });
    } else {

      // check to see if if we are editing an element or not
      switch(req.session.editElement){
        case 'telephone':
          res.redirect('mp-confirm_details_lite');
          break;
        default:
          res.redirect('mp-dob');
      }


    }

  phoneNumberVerificationTest(req);

})

// Multi-part journey ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set D.O.B. ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-dob', function (req, res) {

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    //capture patient DOB
    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];

  if (req.body['dob-day'] === '' || req.body['dob-month'] === '' || req.body['dob-year'] === '') {
    res.render('clinical-callback/mp-dob', {
      session: req.session,
      error: {
        general: 'A date of birth is required to book a phone call',
        dob: 'Please enter a date of birth'
      }
    });
  } else {
    res.redirect('mp-address-lookup');
  }

})


// Multi-part journey +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// set address. ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-address-lookup', function (req, res) {
    res.redirect('mp-confirm_details_lite');
})

// Multi-part journey +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// change phone number ++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/mp-confirm_details_lite', function (req, res) {

    if (!req.session.editElement) {
        req.session.editElement = {}
    }

    req.session.editElement = req.body['element'];

    //move to page depending on the element you are editing
    switch(req.session.editElement){
      case 'telephone':
        res.redirect('mp-telephone');
        break;
      default:
        res.redirect('mp-confirm_details_lite'); //redirect to same page
    }

})


// Check person +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/clinical-callback/check-person', function (req, res) {
  res.render('clinical-callback/details_2', {
    session: req.session
  });
})

// Contact details - single page contact form +++++++++++++++++++++++++++++++++

router.get('/clinical-callback/details_2', function (req, res) {
  res.render('clinical-callback/details_2', {
        session: req.session
  });

});

router.post('/clinical-callback/details_2', function (req, res) {
	if (!req.body['tel-number']) {
      res.render('clinical-callback/details_2', {
          session: req.session,
          error: {
            general: 'A phone number is required to book a call',
            telephone: 'Please enter a phone number',
          }
      });
    } else {
		setPersonalDetailsSessionData(req);
		phoneNumberVerificationTest(req);
		res.redirect('confirm_details_lite');
	}
})

// Home address manual +++++++++++++++++++++++++++++++++

router.post('/clinical-callback/home-address-manual', function (req, res) {

    if (!req.session.homeAddress) {
    req.session.homeAddress = {}
  }

  req.session.homeAddress.address = [
    req.body['address-1'],
    req.body['address-2'],
    req.body['address-3'],
    req.body['address-4']
  ];
  req.session.homeAddress.postcode = req.body['postcode'];

  if (!req.body['address-1'] && !req.body['address-4']) {
    res.render('clinical-callback/home-address-manual', {
      error: 'Please enter your full address'
    });
  } else {
    res.redirect('details_2');
  }

})

// phone verifcation test  +++++++++++++++++++++++++++++++++

function phoneNumberVerificationTest(req) {
    if (!req.session.numberVerificationTestPerformed) req.session.telephoneNumber = scramblePhoneNumber(req.session.telephoneNumber);
    req.session.numberVerificationTestPerformed = true;
}

// Scramble +++++++++++++++++++++++++++++++++

function scramblePhoneNumber(number) {
    var chars = number.split("");
    var lastdigit = Number(chars[chars.length - 1]);
    var newLastDigit = 8;
    if (lastdigit < 9) newLastDigit = lastdigit + 1;

    chars[chars.length - 1] = newLastDigit;
    return chars.join("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set personal details +++++++++++++++++++++++++++++++++

function setPersonalDetailsSessionData(req) {
    if (!req.session.homeAddress) {
        req.session.homeAddress = {}
    }

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    if (!req.session.informant) {
        req.session.informant = {}
    }

    req.session.homeAddress.address = [
        req.body['address-1'],
        req.body['address-2'],
        req.body['address-3'],
        req.body['address-4']
    ];
    if (req.body['check-person'] == "self") {
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
    } else {
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];
    }
    req.session.homeAddress.postcode = req.body['postcode'];
    req.session.telephoneNumber = req.body['tel-number'];

    req.session.informant.firstName = req.body['informant-first-name'];
    req.session.informant.lastName = req.body['informant-last-name'];
    req.session.checkPerson = req.body['check-person'];

    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];
}


// Multi-part +++++++++++++++++++++++++++++++++
// set person +++++++++++++++++++++++++++++++++

function setPerson(req){

    if (!req.session.pronoun) {
        req.session.pronoun = {}
    }

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    if (!req.session.informant) {
        req.session.informant = {}
    }

    if (req.body['check-person'] == "self") {
        //capture pateints name data
        req.session.patient.firstName = req.body['self-first-name'];
        req.session.patient.lastName = req.body['self-last-name'];
        req.session.pronoun = 'your';
    } else {
        //capture pateints name data
        req.session.patient.firstName = req.body['first-name'];
        req.session.patient.lastName = req.body['last-name'];

        //capture informant data - this details of someone to speak to.
        req.session.informant.firstName = req.body['informant-first-name'];
        req.session.informant.lastName = req.body['informant-last-name'];

        req.session.pronoun = 'their';
    }

}


// Multi-part +++++++++++++++++++++++++++++++++
// set DOB ++++++++++++++++++++++++++++++

function setDOB(req) {

    if (!req.session.patient) {
        req.session.patient = {
            dob: {}
        }
    }

    //capture patient DOB
    req.session.patient.dob.day = req.body['dob-day'];
    req.session.patient.dob.month = req.body['dob-month'];
    req.session.patient.dob.year = req.body['dob-year'];

}


// location - address lookup.
// find location

router.get('/location/', function (req, res) {
  req.session.destroy();
  res.render('index.html');
});


// postcode lookup

router.post('/location/postcode', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/postcode', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/postcode', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {

      res.redirect('/service-list/service-list');
  }

})

// postcode lookup on federated start page.

router.post('/location/federated-start', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {
      res.redirect(whichService(req.body['postcode']));

  }

})

router.post('/location/postcode-service', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

  if (req.body['postcode'] === '') {

      req.session.postcode = '';

      res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'Please enter a postcode'
          }

      });
  } else if (req.body['postcode'].length < 4)  {
        res.render('location/federated-start', {
          session: req.session,
          error: {
            general: 'A full valid UK postcode is required',
            postcode: 'This is not a correct UK postcode'
          }
      });

    } else {
      res.redirect('gp-dx');

  }

})

function whichService (enteredPostCode) {

  var returnedObject = '';

  console.log(enteredPostCode);
  enteredPostCode = enteredPostCode.replace(/\s/g, '');
  enteredPostCode = enteredPostCode.toLowerCase();
 console.log(enteredPostCode);
  //decide which url it goes to

  if (enteredPostCode === 'ls15123') {
    var returnedObject = 'service-111-online';
    return returnedObject;
   } else if (enteredPostCode === 'sw1123') {
    var returnedObject = 'service-babylon';
    return returnedObject;
  } else if (enteredPostCode === 'su30123') {
    var returnedObject = 'https://www.111onlinesuffolk.careuk.com/portal/careuk/';
    return returnedObject;
  } else {
    var returnedObject = 'federated-fail';
    return returnedObject;
  }

}


router.post('/location/address-auto-display', function (req, res) {
  res.redirect('service-babylon');
})

router.post('/location/index_man_auto_error', function (req, res) {

    if (!req.session.postcode) {
         req.session.postcode = req.body['postcode'];
    }

    if (req.body['postcode'] === '') {

        req.session.postcode = '';

        res.render('location/index', {
            session: req.session,
            error: {
              general: 'A full valid UK postcode is required',
              postcode: 'Please enter a postcode'
            }

        });
    } else if (req.body['postcode'].length < 4)  {
          res.render('location/index', {
            session: req.session,
            error: {
              general: 'A full valid UK postcode is required',
              postcode: 'This is not a correct UK postcode'
            }
        });

      } else {
        res.redirect('/service-list/service-list');
    }

})


// Hard interrupt +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/emergency-feedback/hard-interrupt--question-1', function(req, res) {
  if (req.body['answer'] === 'yes') {
    res.redirect('/emergency-feedback/hard-interrupt--interrupt');
  } else {
    res.send('another question');
  }
});
