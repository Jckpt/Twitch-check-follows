const input = document.querySelectorAll('input');
let all_nicks = [];
let count = 0;
let nick_json = '';
// fetchuje liste uzytkownikow aktualnie zalogowanych na czacie (fetches users that are currently connected to chat)
function activate() {
	$('#informator').html('<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> praca praca..');
	let channel_name = document.getElementById('chat').value;
	let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
		targetUrl = 'https://tmi.twitch.tv/group/user/' + channel_name + '/chatters';
	fetch(proxyUrl + targetUrl).then((blob) => blob.json()).then((data) => {
		//console.table(data);
		for (var j = 0; j < data.chatters.viewers.length; j++) {
			var name = data.chatters.viewers[j];
			findID(name.toLowerCase());
		}
	});
}

function calculate_date(follow_date) {
	follow_date = follow_date.substring(0, 10);
	follow_date = new Date(follow_date);
	var d = new Date();
	var diff = new Date(d - Date.parse(follow_date)) / 86400000;
	diff = Math.trunc(diff);
	return diff;
}

function createJSON(user_nick) {
	var user_nick, raw_json;
	all_nicks.push(user_nick);
	console.log(all_nicks);
	nick_json += '{"nick":"' + all_nicks[count] + '"},';
	raw_json = '{"users":[' + nick_json + ']}';
	raw_json = raw_json.replace(/},]/, "}]");
	count++;
	return raw_json;
}

input[0].onkeyup = (event) => {
	if (event.which == 13) {
		if (input[0].value == '' || input[1].value == '') {
			$('#informator').html('<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> jedno z pól jest puste');
		}
		else {
			if ($('.user-info')[0]) {
				$('div.user-info').remove();
				activate();
			}
			else if ($('#json_output')) {
				$('#json_output').remove();
				activate();
			}
			else {
				activate();
			}
		}
	}
};
input[1].onkeyup = (event) => {
	if (event.which == 13) {
		if (input[0].value == '' || input[1].value == '') {
			$('#informator').html('<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> jedno z pól jest puste');
		}
		else {
			if ($('.user-info')[0]) {
				$('div.user-info').remove();
				activate();
			}
			else if ($('#json_output')) {
				$('#json_output').remove();
				activate();
			}
			else {
				activate();
			}
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
			// console.log(result); // result zawiera informacje o uzytkowniku (result contains info about user)
			if ($('#checkbox_json').prop('checked') == false) {
				insertChannelHTML(result.users[0]._id, name, result.users[0].logo);
			}
			else {
				insertChannelHTML(result.users[0]._id, name, null);
			}
		});
}

function insertChannelHTML(id, user_nick, avatar) {
	let wanted_channel = document.getElementById('wanted_channel').value;
	let raw_json;
	if ($('#checkbox_json').prop('checked') == false) {
		avatar = avatar.replace(/300x300/, '70x70'); // zmiana wielkosci awataru na mniejszy (changes size of avatars in URL)
	}
	fetch('https://api.twitch.tv/kraken/users/' + id + '/follows/channels', {
		headers: {
			Accept: 'application/vnd.twitchtv.v5+json',
			'Client-ID': 'k1c1q8lb5qd9oxn9cnfjnh2manhuo0'
		}
	})
		.then((response) => response.json())
		.then((result) => {
			//console.log(result); // result zawiera followy uzytkownika (result contains follows of user)
			for (var i = 0; i < result.follows.length; i++) {
				if (result.follows[i].channel.name === wanted_channel) {
					days = calculate_date(result.follows[i].created_at);
					if ($('#checkbox_json').prop('checked') == false) {
						document.getElementById('app_output').innerHTML +=
							'<div class="user-info">' +
							'<img class="avatar-image" src="' +
							avatar +
							'" title="' + days + ' dni"><div class="asd">' +
							user_nick +
							'</div></div>';
					}
					else {
						raw_json = createJSON(user_nick);
						$('#app_output').html('<div id="json_output">' + raw_json + '</div>');
					}
					$(function () {
						$(document).tooltip();
					});
					$('#informator').html('');
					break;
				}
			}
		});
	$('#informator').html('<img src="https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/2x"><img src="https://cdn.betterttv.net/emote/576befd71f520d6039622f7e/2x"> przetwarzanie danych');
}
