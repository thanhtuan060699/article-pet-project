'use strict'

const mongoose = require('mongoose');
const moment = require('moment')
const Post = mongoose.model('Post')

exports.save = (req, res)=>{
  Post.create({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    active: req.body.active,
  }, (err, post) =>
  {
    if (err) { return res.status(400).send({ message: err }); }
    return res.status(200).json(post)
  });
}

var fillArray = function(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
};


exports.delete = (req, res)=>{
  Post.remove({ _id: req.params.id}, function(err) {
    if (err) { 
      return res.status(400).send({ message: err });
    }
    else{
      return res.status(200).send({});
    }
  });
}

exports.get = (req, res)=>{
  Post.findOne({
    _id : req.params.id
  }).exec((err, post)=>{
    if (err) { 
      return res.status(400).send({ message: err });
    }
    else{
      return res.status(200).send({post});
    }
  })
}

exports.update=(req,res)=>{
  Post.findOneAndUpdate(
    { _id: req.params.id },
    {
        $set: req.body
    }
  ).exec((err)=>{
    if (err) { 
      return res.status(400).send({ message: err });
    }
    else{
      return res.status(200).send({});
    }
  })
}

var enumerateDaysBetweenDates = function(startDate, endDate) {
  var dates = [];
  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).endOf('day');
  dates.push(currDate.clone().format('L'));
  while(currDate.add(1, 'days').diff(lastDate) <= 0) {
    dates.push(currDate.clone().format('L'));
  }
  return dates;
};

exports.statisticPostDay=(req, res) =>{
  var query = req.query,
    fromDate = query.from,
    toDate = query.to;
  var startDate = new Date(moment(fromDate));
  var endDate = new Date(moment(toDate));
  var aggregateOpts = [{
    $match: {
      $and: [
      {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      },
      ]
    }
  },
  {
    $group: {
      _id: {
        'year': { '$year': '$createdAt' },
        'month': { '$month': '$createdAt' },
        'day': { '$dayOfMonth': '$createdAt' }
      },
      day: { $max :  { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
      value: { $sum: 1 }  
    }
  },
  { 
    '$sort': { 
      '_id.year': 1,
      '_id.month': 1,
      '_id.day': 1 
    } 
  }
  ];

  Post.aggregate(aggregateOpts).exec((e, d) => {
    var result = {};
    result.days=[];
    result.data=[];
    result.count=0;
    result.days = enumerateDaysBetweenDates(startDate, endDate);
    result.data = fillArray(null, result.days.length);
    d.forEach((i) => {
      var dateStr = moment(i.day).format('L');
      var indexOfDate = result.days.indexOf(dateStr);
      if (indexOfDate >= 0) {
        result.data[indexOfDate] = i.value;
      }
      result.count = result.count + i.value;
    });
    return res.status(200).send({result});
  });
  
}

exports.statisticPostCategory=(req, res) =>{
  var query = req.query,
    fromDate = query.from,
    toDate = query.to;
  var startDate = new Date(moment(fromDate));
  var endDate = new Date(moment(toDate));
  var aggregateOpts = [{
    $match: {
      $and: [
      {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      },
      ]
    }
  },
  {
    $group: {
      _id: {
        category: '$category',
      },
      count: { $sum: 1 }  
    }
  },

  ];

  Post.aggregate(aggregateOpts).exec((e, r) => {
    if (e) { 
      return res.status(400).send({ message: e });
    }
    else{
      return res.status(200).send({r});
    }
  });
  
}


