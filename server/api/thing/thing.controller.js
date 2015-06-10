/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');



// Get list of things
exports.index = function (req, res) {

    var moment = require('moment');

    var startDate = req.param('startDate');
    var endDate = req.param('endDate');

    console.log(startDate);
    console.log(endDate);

    var m_startDate = moment(Number(startDate)).startOf('day');
    var m_endDate = moment(Number(endDate)).startOf('day');

    var druid_start_date = m_startDate.format("YYYY-MM-DDTHH:00:00Z");
    var druid_end_date = m_endDate.format("YYYY-MM-DDTHH:00:00Z");

    console.log(druid_start_date + " : " + druid_end_date);


    var druidRequesterFactory = require('facetjs-druid-requester').druidRequesterFactory;
    var facet = require('facetjs');
    //var chronology = require('chronology');
    var $ = facet.$;
    var Dataset = facet.Dataset;


    var WallTime = require('chronology').WallTime;
    if (!WallTime.rules) {
        var tzData = require("chronology/lib/walltime/walltime-data.js");
        WallTime.init(tzData.rules, tzData.zones);
    }

    var druidRequester = druidRequesterFactory({
        host: 'druid-broker1-410555.phx01.dev.ebayc3.com' // Where ever your Druid may be
    });

    var context = {
        marketing: Dataset.fromJS({
            source: 'druid',
            dataSource: 'marketing-rollup',  // The datasource name in Druid
            timeAttribute: 't',  // Druid's anonymous time attribute will be called 'time'
            requester: druidRequester
        })
    };


    var ex = $()
        // Define the dataset in context with a filter on time and language
        .def("marketing",
        $('marketing').filter($("t").in({
            start: new Date(druid_start_date),
            end: new Date(druid_end_date)
        }).and($('channel').is('onsite')))
    )
        .apply('ByDay',
        $('marketing').split($("t").timeBucket('P1D', 'Etc/UTC'), 'TimeByDay')
            .sort('$TimeByDay', 'ascending')
            .apply('Ercc',
            $('marketing').split('$ercc', 'Ercc')
                .apply('Impressions', '$marketing.sum($im)')
                .apply('Clicks', '$marketing.sum($cl)')
                .sort('$Impressions', 'descending')
                .limit(20)
                .apply('Mpid',
                $('marketing').split('$mpid', 'Mpid')
                    .apply('Impressions', '$marketing.sum($im)')
                    .apply('Clicks', '$marketing.sum($cl)')
                    .sort('$Impressions', 'descending')
                    //.limit(10)
            )
        )
    );

    ex.compute(context).then(function(data) {
        res.json(data.toJS());
    }).done();


    /*res.json([
        {
            name: 'Development Tools',
            info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
        }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
        }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
        }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
        }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
        }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
        }, {
            name: 'Foo',
            info : 'Bar'
        }
    ]);*/
};
