var cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000},
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corrolla', year: 2013, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

var shop = {
  registerHandlers: function() {
    this.$filter.on('click', this.handleFilter.bind(this));
    this.$form.on('change', this.handleSelection.bind(this));
    this.$form.on('mouseover', 'select', this.handleCurrentCategory.bind(this));
  },
  handleCurrentCategory: function(e) {
    this.handleSelection('', e.target.id);
  },
  handleSelection: function(e, currentCategory) {
    this.setFilter();
    this.filterCars(currentCategory);
    this.renderFilter();
    this.setSelected();
  },
  handleFilter: function(e) {
    e.preventDefault();
    this.renderCars();
  },
  setFilter: function() {
    this.filter = {};
    $('select').each((i, category) => this.filter[category.id] = category.value);
  },
  filterCars: function(curCat) {
    this.filteredCars = this.allCars.filter(function(car) {
      if (curCat !== 'make' && this.filter.make !== 'All' && this.filter.make !== car.make) return false;
      if (curCat !== 'model' && this.filter.model !== 'All' && this.filter.model !== car.model) return false;
      if (curCat !== 'year' && this.filter.year !== 'All' && +this.filter.year !== car.year) return false;
      if (curCat !== 'price' && this.filter.price !== 'All' && +this.filter.price !== car.price) return false;
      return true;
    }.bind(this));
  },
  renderCars: function() {
    this.$cars.children().remove();
    this.filteredCars.forEach(car => $('#cars').append(this.loadTemplate(car, this.carTemplate)));
  },
  renderFilter: function() {
    $('.filter-template').remove();
    var unique = this.uniqueOptions();
    this.categories.forEach((category) => {
      var source = $('#' + category + '-template').html();
      $('#' + category).append(this.loadTemplate(unique, source));
    });
  },
  uniqueOptions: function() {
    var unique = {};
    this.categories.forEach(category => unique[category] = []);
    this.filteredCars.forEach((car) => {
      this.categories.forEach((category) => {
        if (!unique[category].includes(car[category])) unique[category].push(car[category]);
      });
    });
    unique.price.sort((a, b) => a - b);
    unique.year.sort((a, b) => a - b);
    return unique;
  },
  setSelected: function() {
    $('select').each((i, selector) => {
      var $element = $('option[value="' + this.filter[selector.id] + '"]');
      if ($element.val() !== 'All') $element[0].selected = 'selected';
    });
  },
  loadTemplate: function(context, source) {
    var template = Handlebars.compile(source);
    return template(context);
  },
  init: function() {
    this.$cars = $('#cars');
    this.$filter = $('#filter');
    this.$form = $('form');
    this.carTemplate = $('#car-template').html();

    this.categories = ['make', 'model', 'year', 'price']
    this.allCars = cars;
    this.filteredCars = this.allCars;
    this.renderCars();
    this.renderFilter();
    this.registerHandlers();
  }
}

shop.init();