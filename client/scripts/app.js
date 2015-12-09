var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    var likeState = !this.get('like');
    this.set('like',likeState);
    // your code here
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    this.on('change',  function(){
      this.sort();
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort();
    // your code here
  }

});
var selected;
var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },


  handleClick: function(e) {
    var field = $(e.target).val();

    //comparator function used to toggle sorting from accending to decending.
    var reverseCompareator = function(a,b){
      if(a.get(field)-b.get(field)>0 || a.get(field) === b.get(field)){
        return -1;
      }else{
        return 1;
      }
    };

  // test to see if it should sort  or reverse sort.
    if(selected !== field){
      this.collection.sortByField(field);
      selected = $(e.target).val();
    }else{
      this.collection.sortByField(reverseCompareator);
      selected = null;
    }
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'down\' : \'up\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    this.model.on('change' ,function(){
      this.render();
    },this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
    // your code here
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  model: Movies,

  initialize: function() {
    // your code here
    this.collection.on('sort' ,function(){
      this.render();
    },this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
