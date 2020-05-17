const input = document.querySelectorAll('input');
// fetchuje liste uzytkownikow aktualnie zalogowanych na czacie (fetches users that are currently connected to chat)
function activate() {
	$('#informator').html('<img src="https://static-cdn.jtvnw.net/emoticons/v1/2113050/2.0"> praca praca..');
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
			if ($('#checkbox_avatar').prop('checked')) {
				insertChannelHTML(result.users[0]._id, name, result.users[0].logo);
			}
			else {
				insertChannelHTML(result.users[0]._id, name);
			}
		});
}

function insertChannelHTML(id, name, avatar) {
	let wanted_channel = document.getElementById('wanted_channel').value;
	if ($('#checkbox_avatar').prop('checked')) {
		avatar = avatar.replace(/300x300/, '70x70'); // zmiana wielkosci awataru na mniejszy
	}
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
					if ($('#checkbox_avatar').prop('checked')) {
						document.getElementById('app_output').innerHTML +=
							'<div class="user-info">' +
							'<img src="' +
							avatar +
							'"><div class="asd">' +
							name +
							'</div></div>';
					}
					else {
						document.getElementById('app_output').innerHTML +=
							'<div class="user-info"> <div class="asd">' + name + '</div></div>';
					}
					$('#informator').html(
						'<img src="https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/2x"><img src="https://cdn.betterttv.net/emote/576befd71f520d6039622f7e/2x">'
					);
				}
			}
		});
	$('#informator').html('<img src="https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/2x"><img src="https://cdn.betterttv.net/emote/576befd71f520d6039622f7e/2x"> przetwarzanie danych');
}
