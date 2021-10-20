var loc = require('./index.js');

loc.getList(function(res){
    //console.log(res); //full list
    console.log(loc.getCarMakes());
    //console.log(loc.getCarCategories());
    //console.log(loc.getCarsByCategoryObj());
})

var fullList = loc.getListSync()

console.log(loc.getCarMakes());
//console.log(loc.getCarCategories());
//console.log(loc.getCarsByMakeObj());
//console.log(loc.getCarsByCategoryObj());

/*
full dataset -- list of models:
[
  { Year: 2020, Make: 'Audi', Model: 'Q3', Category: 'SUV' },
  { Year: 2020, Make: 'Chevrolet', Model: 'Malibu', Category: 'Sedan' },
 ...
    ~9500 more items
]
 */

/*
list of makes:
[
  'Audi',         'Chevrolet',    'Cadillac',    'Acura',
  'BMW',          'Chrysler',     'Ford',        'Buick',
  'INFINITI',     'GMC',          'Honda',       'Hyundai',
  'Jeep',         'Genesis',      'Dodge',       'Jaguar',
  'Kia',          'Land Rover',   'Lexus',       'Mercedes-Benz',
  'Mitsubishi',   'Lincoln',      'MAZDA',       'Nissan',
  'MINI',         'Porsche',      'Ram',         'Subaru',
  'Toyota',       'Volkswagen',   'Volvo',       'Alfa Romeo',
  'FIAT',         'Freightliner', 'Maserati',    'Tesla',
  'Aston Martin', 'Bentley',      'Ferrari',     'Lamborghini',
  'Lotus',        'McLaren',      'Rolls-Royce', 'smart',
  'Scion',        'SRT',          'Suzuki',      'Fisker',
  'Maybach',      'Mercury',      'Saab',        'HUMMER',
  'Pontiac',      'Saturn',       'Isuzu',       'Panoz',
  'Oldsmobile',   'Daewoo',       'Plymouth',    'Eagle',
  'Geo',          'Daihatsu'
]
 */

/*
categories -- note some cars span multiple categories
[
  'SUV',
  'Sedan',
  'Coupe, Convertible',
  'Pickup',
  'Van/Minivan',
  'Convertible',
  'Hatchback, Sedan, Coupe',
...
]
 */
