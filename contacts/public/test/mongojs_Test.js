/**
 * Created by nizhang on 12/8/2015.
 */
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contacts']);

var contactList = [{
    id: 1,
    userId: 1,
    firstName: ['Merrisa', 'text'],
    lastName: ['Li', 'text'],
}, {
    id: 2,
    userId: 2,
    firstName: ['Carson', 'text'],
    lastName: ['Zhang', 'text'],
}, {
    id: 3,
    userId: 3,
    firstName: ['Aaron', 'text'],
    lastName: ['Sheng', 'text'],
}];


db.contacts.insert(contactList, function (err) {
    console.log(err)
});

//db.contacts.find(function (err, data) {
//    data.forEach(function (element, index) {
//        console.log('data[' + index + '] = ' + JSON.stringify(element));
//    });
//});

//var dbQuery = {firstName: 'Merrisa'};
//
//db.contacts.remove(dbQuery, true, function (err, data) {
//    if (err) {
//        console.log('error happens: ' + err.message);
//    } else {
//        console.log('delete succeed');
//    }
//});
//
//db.contacts.findOne(dbQuery, function (err, data) {
//    console.log(JSON.stringify(data));
//    data.email = 'Merrisa.Li@hpe.com';
//    db.contacts.update(dbQuery, data, function (err, data) {
//        if (err) {
//            console.log('error happens: ' + err.message);
//        } else {
//            console.log('update successfully');
//        }
//    });
//});