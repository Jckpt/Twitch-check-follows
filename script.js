let nickJson = '';
// fetchuje liste uzytkownikow aktualnie zalogowanych na czacie (fetches users that are currently connected to chat)
let activate = async () => {
  document.querySelector('#informator').innerHTML = '<img src="https://cdn.frankerfacez.com/emoticon/149346/2"> praca praca..';
  let channelName = document.getElementById('chat').value.toLowerCase();
  let proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = `https://tmi.twitch.tv/group/user/${channelName}/chatters`;
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

let calculate_date = (followDate) => {
  followDate = followDate.substring(0, 10);
  followDate = new Date(followDate);
  let d = new Date();
  let diff = new Date(d - Date.parse(followDate)) / 86400000;
  diff = Math.trunc(diff);
  return diff;
};

let createJSON = (userNick, reset) => {
  let rawJson;
  if (reset) {
    rawJson = '';
    nickJson = '';
  }
  nickJson += `{"nick":"${userNick}"},`;
  rawJson = `{"users":[${nickJson}]}`;
  rawJson = rawJson.replace(/},]/, '}]');
  return rawJson;
};
document.querySelectorAll('input').forEach((item) => {
  item.addEventListener('keyup', (event) => {
    if (event.which == 13) {
      if (document.querySelectorAll('input')[0].value == '' || document.querySelectorAll('input')[1].value == '') {
        document.querySelector('#informator').innerHTML = 'jedno z pól jest puste';
      } else {
        if (document.body.contains(document.getElementsByClassName('user-info')[0])) {
          document.querySelectorAll('.user-info').forEach(function (a) {
            a.remove();
          });
          activate();
        } else if (document.body.contains(document.getElementById('json_output'))) {
          document.querySelector('#json_output').remove();
          createJSON(null, true);
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
  if (!document.querySelector('#checkbox_json').checked) {
    insertChannelHTML(user._id, name, user.logo);
  } else {
    insertChannelHTML(user._id, name, null);
  }
};

let insertChannelHTML = async (id, userNick, avatar) => {
  let wantedChannel = document.getElementById('wanted_channel').value.toLowerCase();
  if (!document.querySelector('#checkbox_json').checked) {
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
  document.querySelector('#informator').innerHTML = '';
  for (let i = 0; i < follows.length; i++) {
    if (follows[i].channel.name === wantedChannel) {
      let days = calculate_date(follows[i].created_at);
      if (!document.querySelector('#checkbox_json').checked) {
        document.getElementById(
          'app_output'
        ).innerHTML += `<div class="user-info"><div><img class="avatar-image" src="${avatar}" title="${days} dni"></div><div class="asd">${userNick}</div></div>`;
      } else {
        let rawJson = createJSON(userNick);
        document.getElementById('app_output').innerHTML = `<div id="json_output">${rawJson}</div>`;
        rawJson = '';
      }
      break;
    }
  }
};
