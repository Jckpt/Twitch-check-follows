const input = document.querySelectorAll('input');
let user_info_divs;
// test from already existing file on my computer xD
function activate_test() {
	fetch('json/chatters.json').then((blob) => blob.json()).then((data) => {
		console.table(data);
		for (var j = 0; j < data.chatters.viewers.length; j++) {
			var name = data.chatters.viewers[j];
			findID(name.toLowerCase());
		}
	});
}
// fetchuje liste uzytkownikow aktualnie zalogowanych na czacie (fetches users that are currently connected to chat)
function activate() {
	$('#informator').html('<img src="https://static-cdn.jtvnw.net/emoticons/v1/2113050/1.0"> praca praca..');
	let channel_name = document.getElementById('chat').value;
	let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
		targetUrl = 'https://tmi.twitch.tv/group/user/' + channel_name + '/chatters';
	fetch(proxyUrl + targetUrl).then((blob) => blob.json()).then((data) => {
		console.table(data);
		for (var j = 0; j < data.chatters.viewers.length; j++) {
			var name = data.chatters.viewers[j];
			findID(name.toLowerCase());
		}
	});
}
input[0].onkeyup = (event) => {
	if (event.which == 13) {
		if ($('.user-info')[0]) {
			$('div.user-info').remove();
			activate();
		} else {
			activate();
		}
	}
};
input[1].onkeyup = (event) => {
	if (event.which == 13) {
		if ($('.user-info')[0]) {
			$('div.user-info').remove();
			activate();
		} else {
			activate();
		}
	}
};
// szuka id uzytkownika po nicku (searches user ID by their nick)
function findID(name) {
	fetch('https://api.twitch.tv/kraken/users?login=' + name, {
		headers: {
			Accept: 'application/vnd.twitchtv.v5+json',
			'Client-ID': 'k1c1q8lb5qd9oxn9cnfjnh2manhuo0'
		}
	})
		.then((response) => response.json())
		.then((result) => {
			console.log(result); // result zawiera informacje o uzytkowniku (result contains info about user)
			insertChannelHTML(result.users[0]._id, name, result.users[0].logo);
		});
}

function insertChannelHTML(id, name, avatar) {
	let wanted_channel = document.getElementById('wanted_channel').value;
	avatar = avatar.replace(/300x300/, '70x70');
	fetch('https://api.twitch.tv/kraken/users/' + id + '/follows/channels', {
		headers: {
			Accept: 'application/vnd.twitchtv.v5+json',
			'Client-ID': 'k1c1q8lb5qd9oxn9cnfjnh2manhuo0'
		}
	})
		.then((response) => response.json())
		.then((result) => {
			console.log(result); // result zawiera followy uzytkownika (result contains follows of user)
			// przyklad linku do awatara https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1dd-9f00b46cbd3d-profile_image-70x70.png
			for (var i = 0; i < result.follows.length; i++) {
				if (result.follows[i].channel.name === wanted_channel) {
					document.getElementById('app_output').innerHTML +=
						'<div class="user-info">' +
						'<img src="' +
						avatar +
						'"><div class="asd">' +
						name +
						'</div></div>';
				}
			}
		});
	$('#informator').html('<img src="https://static-cdn.jtvnw.net/emoticons/v1/2113050/1.0"> praca została zakończona');
}
