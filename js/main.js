var bodyTemplateSrc = $('#body-template').html();
var bodyTemplate = Handlebars.compile(bodyTemplateSrc);

var username = 'Guest';
var avatarUrl = 'http://minionslovebananas.com/images/check-in-minion.jpg';

var root = new Firebase('https://tkatzen-chat.firebaseio.com');
var chatRoom = root.child('chat');

var messages = {};

$(document).ready(function() {
	setupMessageLoader();
});

function renderTemplate() {
	var context = {
		username: username,
		messages: messages
	};
	
	var renderedTemplate = bodyTemplate(context);
	$('#body-template-view').html(renderedTemplate);
	scrollToBottomOfChatWindow();
	
	setupTemplateListeners();
}

function setupMessageLoader() {
	chatRoom.on('value', function(snapshot) {
		messages = snapshot.val();
		renderTemplate();
	});
}

function setupTemplateListeners() {
	$('#chat-box').keypress(function(e) {
		if (e.which === 13) { // Enter
			sendMessage();
		}
	});
	
	$('#send-button').click(function() {
		sendMessage();
	});
	
	$('#fb-login').click(function() {
		root.authWithOAuthPopup('facebook', function(err, authData) {
			loginWithAuthData(authData);
		});
	});
	
	$('#chat-box').focus();
}

function loginWithAuthData(authData) {
	console.log(authData);
	username = authData.facebook.displayName;
	avatarUrl = authData.facebook.cachedUserProfile.picture.data.url;
	renderTemplate();
}

function sendMessage() {
	var message = $('#chat-box').val();
	
	// Avatar, Username, Content!
	chatRoom.push({
		avatarUrl: avatarUrl,
		username: username,
		content: message,
		timestamp: Firebase.ServerValue.TIMESTAMP
	});
	
	$('#chat-box').val('');
}

Handlebars.registerHelper('getDateString', getDateString);
function getDateString(timestamp) {
	return moment(new Date(timestamp)).fromNow();
}
