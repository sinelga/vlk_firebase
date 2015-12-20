      
 $(function() {
	 var event_bus = _({}).extend(Backbone.Events);
	 
	 var MyTodo = Backbone.Model.extend({
	 });
	 
	 var VlkClientModel = Backbone.Model.extend({
		 
	 });
	 
	 var VlkClientsCollection = Backbone.Firebase.Collection.extend({
		   model: VlkClientModel ,
		   url: "https://vlk-clients.firebaseio.com"
		 });
	 

	 var MyTodoCollection = Backbone.Firebase.Collection.extend({
	   model: MyTodo,
	   url: "https://vlk-firebase.firebaseio.com"
	 });
	 	 
	 
	 var TodoView = Backbone.View.extend({
		  tagName:  "li",
		  template: _.template("<span class='badge'><%=id %></span><%= title %>"),
		  initialize: function() {
//		    this.listenTo(this.model, "change", this.render);
		  },
		  events: {
			  "click" : "select_activity"
		  },
		  
		  render: function() {
		    this.$el.html(this.template(this.model.toJSON()));
		    return this;
		  },
		  select_activity: function() {
			    		   
			    event_bus.trigger("select_activity",this.model);			    
		  }		  
		});
	 
	// The view for the entire application
	 var MyAppView = Backbone.View.extend({
	   el: $('#mytodoapp'),
	   initialize: function() {
	     this.list = this.$("#todo-items"); // the list to append to
	     this.listenTo(this.collection, 'add', this.addOne);
	   },
	   addOne: function(todo) {
	     var view = new TodoView({model: todo});
	     this.list.append(view.render().el);
	   }
	 });
	 
	 _.mixin({templateFromUrl: function (url, data, settings) {
		    var templateHtml = "";
		    this.cache = this.cache || {};

		    if (this.cache[url]) {
		        templateHtml = this.cache[url];
		    } else {
		        $.ajax({
		            url: url,
		            method: "GET",
		            async: false,
		            success: function(data) {
		                templateHtml = data;
		            }
		        });

		        this.cache[url] = templateHtml;
		    }

		    return _.template(templateHtml, data, settings);
		}});
	 	 
	 var ShowActivity = Backbone.View.extend({
		 className: 'media',
//		 template: _.template("<%= title %><%=details  %>"),
		 initialize: function() {
		 

		 },
		  events: {
			  "click .btn" : "save_client"
		  }, 
		 		 
		 render: function() {
			 
			 var selectedHtml = _.templateFromUrl("templates/selected.html", {});	 			 
//			    this.$el.html(this.template(this.model.toJSON()));
			 this.$el.html(selectedHtml(this.model.toJSON()));
		     this.name = this.$("#name");
		     this.email = this.$("#email");
		     this.phone = this.$("#phone");
			 return this;
			 
		 },
		 
		   save_client: function(event) {
			   event.preventDefault();   
			   console.log(" save_client",this.name.val());
			   var vlkclientscollection = new VlkClientsCollection();
			   var today = new Date();
			   vlkclientscollection.create({date:today.toString(),name:this.name.val(),email:this.email.val(),phone:this.phone.val()});
			   this.name.val('');
			   this.email.val('');
			   this.phone.val('');
			   
//				    event_bus.trigger("select_activity",this.model);			    
			  }	
		 
	 });
	 	 
	 var MySelectedView = Backbone.View.extend({
		 el: $('#mytodoapp'),
		 initialize: function() {
		     this.list = this.$("#selected"); // the list to append to
		     this.listenTo(event_bus, 'select_activity', this.activity_was_selected);
		     
		     this.name = this.$("#name");
		     this.email = this.$("#email");
		     this.phone = this.$("#phone");
		 },
//		  events: {
//			  "click .btn" : "save_client"
//		  }, 
		 		 
		 activity_was_selected: function(model) {

			 	var view = new ShowActivity({model: model});	
			     this.list.empty();
			     this.list.append(view.render().el);
			   
		   }
//		   save_client: function(event) {
//			   event.preventDefault();   
//			   console.log(" save_client",this.name.val());
//			   var vlkclientscollection = new VlkClientsCollection();
//			   vlkclientscollection.create({name:this.name.val(),email:this.email.val(),phone:this.phone.val()});
////				    event_bus.trigger("select_activity",this.model);			    
//			  }	
		 
	 });
	 	 
	 
	 function initFirebase() {
		  var collection = new MyTodoCollection();
		 
		  var app = new MyAppView({ collection: collection});
		  var slectedzone = new MySelectedView();
		}
	 

	 initFirebase();
	 
	 
//// A simple todo model
//      var Todo = Backbone.Model.extend({
////        defaults: { title: "New Todo" },
//
////        setTitle: function(title) {
////            this.save({'title': title}, {patch: true});
////        }
//      });
//
//      // Create a Firebase collection and set the 'firebase' property
//      // to the URL of your Firebase
//      var TodoCollection = Backbone.Firebase.Collection.extend({
//        model: Todo,
//        url: "https://vlk-firebase.firebaseio.com"
//      });
//
//      // A view for an individual todo item
//      var TodoView = Backbone.Marionette.View.extend({
//        tagName:  "li",
////        template: _.template("<textarea class='todo-title'></textarea> <a href='/delete' class='delete'>delete</a>"),
//        template: _.template("<label class='todo-title'></label>"),
////        ui: {
////            'todoTitle': '.todo-title'
////        },
////        events: {
////          "click .delete": "onDelete",
////          "keyup @ui.todoTitle": "editTodo"
////        },
//        initialize: function() {
////          this.listenTo(this.model, "change", this.render);
//        },
////        onDelete: function(event) {
////          event.preventDefault();
////          console.log(this.model.collection);
////          this.model.collection.remove(this.model);
////          this.remove();
////        },
//        render: function() {
//          this.$el.html(this.template(this.model.toJSON()));
////          this.bindUIElements();
////          this.$('label').val(this.model.get('title'));
//          this.$('label').html(this.model.get('title'));
//          return this;
//        }
////        editTodo: _.debounce(function(e) {
////          this.model.setTitle(this.ui.todoTitle.val());
////        }, 500)
//      });
//
//      // The view for the entire application
//      var AppView = Backbone.View.extend({
//        el: $('#todoapp'),
////        events: {
////          "keypress #new-todo" : "createTodo",
////        },
//        initialize: function() {
//          this.list = this.$("#todo-list"); // the list to append to
////          this.input = this.$("#new-todo"); // the textbox for new todos
//
//          // by listening to when the collection changes we
//          // can add new items in realtime
//          this.listenTo(this.collection, 'add', this.addOne);
//        },
//        addOne: function(todo) {
//          var view = new TodoView({model: todo});
//          this.list.append(view.render().el);
//        }
////        createTodo: function(e) {
////          if (e.keyCode == 13) {
////            if (!this.input.val()) { return; }
////
////            // create a new location in firebase and save the model data
////            // this will trigger the listenTo method above and a new todo view
////            // will be created as well
////            this.collection.create({title: this.input.val()});
////
////            this.input.val('');
////          }
////        }
//      });
//
//      // Create a function to kick off our BackboneFire app
//      function init() {
//        // The data we are syncing from Firebase
//        var collection = new TodoCollection();
//        var app = new AppView({ collection: collection });
//      }
////
//      // When the document is ready, call the init function
////      $(function() {
//        init();
      });