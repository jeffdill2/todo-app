////////////////////////////////////////////////////////////
///////////////////////////////////// INITIALIZE APPLICATION
////////////////////////////////////////////////////////////
var strTasksURL = 'http://tiny-pizza-server.herokuapp.com/collections/jdill-todo-app';

$(document).ready(function() {
	loadTasks();

	$('.form-description').focus();
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
TaskModel = Backbone.Model.extend({
	initialize: function() {
		this.on('change', function() {

		});
	},

	defaults: {
		// human: true
	},

	idAttribute: '_id'
});

////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// VIEW
////////////////////////////////////////////////////////////
TaskView = Backbone.View.extend({
	taskListTemplate: _.template($('.task-list-template').text()),
	taskEditTemplate: _.template($('.task-list-edit-template').text()),

	events: {
		'click .task-modify-button' : 'showEdit',
		'click .task-save-button'   : 'saveChanges',
		'click .task-delete-button' : 'destroy',
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);

		$('.task-list').prepend(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.taskListTemplate(this.model.attributes);
		this.$el.html(renderedTemplate);
	},

	showEdit: function() {
		var renderedTemplate = this.taskEditTemplate(this.model.attributes);
		this.$el.html(renderedTemplate);
	},

	saveChanges: function() {
		var strTaskDescription = this.$el.find('.task-description input').val();
		this.model.set('description', strTaskDescription);
		this.model.save();
	},

	destroy: function() {
		this.model.destroy();
		this.remove();
	},
});

////////////////////////////////////////////////////////////
///////////////////////////////////////////////// CONTROLLER
////////////////////////////////////////////////////////////
TaskCollection = Backbone.Collection.extend({
	model: TaskModel,

	url: strTasksURL,
});

var tasksCollection = new TaskCollection();

////////////////////////////////////////////////////////////
/////////////////////////////////////////////// CONSTRUCTORS
////////////////////////////////////////////////////////////
function Task(strDescription) {
	switch(true) {
		case strDescription.length <= 0:
			throw new Error("The description may not be left blank!");
			break;

		default:
			this.description = strDescription;
			this.date = Date.now();	
			break;
	}
}

////////////////////////////////////////////////////////////
////////////////////////////////////// LOAD AND SUBMIT TASKS
////////////////////////////////////////////////////////////
function loadTasks() {
	tasksCollection.fetch().done(function() {
		tasksCollection.each(function(task) {
			new TaskView({model: task});
		});
	});
}

$('.submit-button').click(function() {
	var objTask = new Task($('.form-description').val());
	var objTaskModel = tasksCollection.add(objTask);

	objTaskModel.save();
	new TaskView({model: objTaskModel});

	$('.form-description').val('');
	$('.form-description').focus();
});

$('.form-description').keypress(function(key) {
	if (key.keyCode == '13') {
		key.preventDefault();

		$('.submit-button').trigger('click');
	}
});