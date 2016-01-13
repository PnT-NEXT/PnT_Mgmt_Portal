 "use strict";

// function foo() {
//   console.log(this); 
// }

// foo();

/**
 * Created by nizhang on 12/8/2015.
 */
var mongojs = require('mongojs'),
    _       = require('lodash'),
    db      = mongojs('contactlist', ['trainings']);

// var contactList = [{
//     id: '534fabb10648cd1c1b000002',
//     userId: 1,
//     firstName: ['Merrisa', 'text'],
//     lastName: ['Li', 'text'],
// }, {
//     id: '56839875e6e5a68c548526d1',
//     userId: 2,
//     firstName: ['Carson', 'text'],
//     lastName: ['Zhang', 'text'],
// }, {
//     id: '5683aaa383e00964538f8902',
//     userId: 3,
//     firstName: ['Aaron', 'text'],
//     lastName: ['Sheng', 'text'],
// }];

// function toMongoId() {
//   if (this) {
//     var value = mongojs.ObjectID(this.id.toString());
//     return value;
//   }
// }

// function toMongoId2(obj) {
//   if (obj) {
//     return mongojs.ObjectID(obj.id.toString());
//   }
// }

// var result1 = _.invoke(contactList, toMongoId);
// console.log(JSON.stringify(result1));

// var result2 = _.map(contactList, toMongoId2);
// console.log(JSON.stringify(result2));

// var strIdArray = _.pluck(contactList, 'id');
// var idArray = _.map(strIdArray, toMongoId);

// console.log(JSON.stringify(idArray));

// var dbQuery = {
//   _id: {$in: idArray}
// }


var user = {
  "name" : "Collabration: FHP-Sharepoint 2010 (应用方向) 1",
  "courseId" : "36301",
  "programType" : "Technical",
  "duration" : "1",
  "city" : "ALL Site",
  "seat" : "20",
  "cost" : "116.91096735668788",
  "instructor" : "Internal Instructor",
}

db.trainings.insert(user, function (err, docs) {
    console.log(docs)
});

// db.trainings.find(dbQuery, function (err, data) {
//   if (err) {
//     console.log('error happens: ' + err.message);
//   } else {
//     data.forEach(function (element, index) {
//         console.log('data[' + index + '] = ' + JSON.stringify(element));
//     });
//   }
// });

// var dbQuery = {courseId: '36300'};
//
//db.contacts.remove(dbQuery, true, function (err, data) {
//    if (err) {
//        console.log('error happens: ' + err.message);
//    } else {
//        console.log('delete succeed');
//    }
//});
//

// var dbQuery = {
//   courseId: '36300'
// };

// db.trainings.findOne(dbQuery, function (err, data) {
//   if (data) {
//     data.property1 = '3';
//     db.trainings.update(dbQuery, {$set: {property1: 3}}, {multi: true}, function (err, data) {
//         if (err) {
//             console.log('error happens: ' + err.message);
//         } else {
//             console.log(data);
//         }
//     });
//   } else {
//     // data is null
//     console.log(data);
//   }
  
// });