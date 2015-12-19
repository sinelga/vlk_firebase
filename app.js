      
 $(function() {

// A simple todo model
      var Todo = Backbone.Model.extend({
//        defaults: { title: "New Todo" },

//        setTitle: function(title) {
//            this.save({'title': title}, {patch: true});
//        }
      });

      // Create a Firebase collection and set the 'firebase' property
      // to the URL of your Firebase
      var TodoCollection = Backbone.Firebase.Collection.extend({
        model: Todo,
        url: "https://vlk-firebase.firebaseio.com"
      });

      // A view for an individual todo item
      var TodoView = Backbone.Marionette.View.extend({
        tagName:  "li",
//        template: _.template("<textarea class='todo-title'></textarea> <a href='/delete' class='delete'>delete</a>"),
        template: _.template("<label class='todo-title'></label>"),
//        ui: {
//            'todoTitle': '.todo-title'
//        },
//        events: {
//          "click .delete": "onDelete",
//          "keyup @ui.todoTitle": "editTodo"
//        },
        initialize: function() {
//          this.listenTo(this.model, "change", this.render);
        },
//        onDelete: function(event) {
//          event.preventDefault();
//          console.log(this.model.collection);
//          this.model.collection.remove(this.model);
//          this.remove();
//        },
        render: function() {
          this.$el.html(this.template(this.model.toJSON()));
//          this.bindUIElements();
//          this.$('label').val(this.model.get('title'));
          this.$('label').html(this.model.get('title'));
          return this;
        }
//        editTodo: _.debounce(function(e) {
//          this.model.setTitle(this.ui.todoTitle.val());
//        }, 500)
      });

      // The view for the entire application
      var AppView = Backbone.View.extend({
        el: $('#todoapp'),
//        events: {
//          "keypress #new-todo" : "createTodo",
//        },
        initialize: function() {
          this.list = this.$("#todo-list"); // the list to append to
//          this.input = this.$("#new-todo"); // the textbox for new todos

          // by listening to when the collection changes we
          // can add new items in realtime
          this.listenTo(this.collection, 'add', this.addOne);
        },
        addOne: function(todo) {
          var view = new TodoView({model: todo});
          this.list.append(view.render().el);
        }
//        createTodo: function(e) {
//          if (e.keyCode == 13) {
//            if (!this.input.val()) { return; }
//
//            // create a new location in firebase and save the model data
//            // this will trigger the listenTo method above and a new todo view
//            // will be created as well
//            this.collection.create({title: this.input.val()});
//
//            this.input.val('');
//          }
//        }
      });

      // Create a function to kick off our BackboneFire app
      function init() {
        // The data we are syncing from Firebase
        var collection = new TodoCollection();
        var app = new AppView({ collection: collection });
      }
//
      // When the document is ready, call the init function
//      $(function() {
        init();
      });