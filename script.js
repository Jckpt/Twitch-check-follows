let all_nicks = [];
let count = 0;
let nick_json = '';
// fetchuje liste uzytkownikow aktualnie zalogowanych na czacie (fetches users that are currently connected to chat)
let activate = async () => {
  $('#informator').html('<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> praca praca..');
  let channel_name = document.getElementById('chat').value.toLowerCase();
  let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = `https://tmi.twitch.tv/group/user/${channel_name}/chatters`;
  const response = await fetch(proxyUrl + targetUrl);
  const blob = await response.json();
  let {
    chatters: { viewers, vips, moderators },
  } = blob;
  const everyViewer = [...viewers, ...vips, ...moderators];
  for (let j = 0; j < everyViewer.length; j++) {
    findID(everyViewer[j].toLowerCase());
  }
};

let calculate_date = (follow_date) => {
  follow_date = follow_date.substring(0, 10);
  follow_date = new Date(follow_date);
  let d = new Date();
  let diff = new Date(d - Date.parse(follow_date)) / 86400000;
  diff = Math.trunc(diff);
  return diff;
};

let createJSON = (user_nick) => {
  let raw_json;
  all_nicks.push(user_nick);
  nick_json += '{"nick":"' + all_nicks[count] + '"},';
  raw_json = '{"users":[' + nick_json + ']}';
  raw_json = raw_json.replace(/},]/, '}]');
  count++;
  return raw_json;
};
document.querySelectorAll('input').forEach((item) => {
  item.addEventListener('keyup', (event) => {
    if (event.which == 13) {
      if (document.querySelectorAll('input')[0].value == '' || document.querySelectorAll('input')[1].value == '') {
        $('#informator').html('<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> jedno z pól jest puste');
      } else {
        if ($('.user-info')[0]) {
          $('div.user-info').remove();
          activate();
        } else if ($('#json_output')) {
          $('#json_output').remove();
          activate();
        } else {
          activate();
        }
      }
    }
  });
});
// szuka id uzytkownika po nicku (searches user ID by their nick)
let findID = async (name) => {
  let response = await fetch(`https://api.twitch.tv/kraken/users?login=${name}`, {
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'k1c1q8lb5qd9oxn9cnfjnh2manhuo0',
    },
  });
  let data = await response.json();
  let {
    users: [user],
  } = data;
  if (!$('#checkbox_json').prop('checked')) {
    insertChannelHTML(user._id, name, user.logo);
  } else {
    insertChannelHTML(user._id, name, null);
  }
};

let insertChannelHTML = async (id, user_nick, avatar) => {
  let wanted_channel = document.getElementById('wanted_channel').value.toLowerCase();
  let raw_json;
  if (!$('#checkbox_json').prop('checked')) {
    avatar = avatar.replace(/300x300/, '70x70'); // zmiana wielkosci awataru na mniejszy (changes size of avatars in URL)
  }
  let response = await fetch('https://api.twitch.tv/kraken/users/' + id + '/follows/channels', {
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'k1c1q8lb5qd9oxn9cnfjnh2manhuo0',
    },
  });
  let data = await response.json();
  let { follows } = data;
  // result zawiera followy uzytkownika (result contains follows of user)
  for (let i = 0; i < follows.length; i++) {
    if (follows[i].channel.name === wanted_channel) {
      days = calculate_date(follows[i].created_at);
      if (!$('#checkbox_json').prop('checked')) {
        document.getElementById(
          'app_output'
        ).innerHTML += `<div class="user-info"><div><img class="avatar-image" src="${avatar}" title="${days} dni"></div><div class="asd">${user_nick}</div></div>`;
      } else {
        raw_json = createJSON(user_nick);
        document.getElementById('app_output').innerHTML = `<div id="json_output">${raw_json}</div>`;
      }
      $('#informator').html('');
      break;
    }
  }
  $('#informator').html(
    '<img src="https://cdn.betterttv.net/emote/56c2cff2d9ec6bf744247bf1/2x"><img src="https://cdn.betterttv.net/emote/576befd71f520d6039622f7e/2x"> przetwarzanie danych'
  );
};
