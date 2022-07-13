/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

var player_type = getQueryVariable("player");
var player_ver = getQueryVariable("player_ver");
var media_url = getQueryVariable("url");
if (!media_url) {
  media_url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
}

let div_player = document.getElementById("players_list");
let current_conf = document.createElement("div");
current_conf.innerHTML = `Current player: &nbsp;<span class='orange'>"${player_type}" &nbsp; { ver: ${player_ver} }</span><br>`;
current_conf.innerHTML += `Stream URL: &nbsp; <input id='url_input' style='width: 600px;' value='${media_url}'></input>&nbsp; `;
current_conf.innerHTML += `<button id="set_url" onclick="set_source_url()">SET</button>`
current_conf.style = "margin: 20px 0;";
div_player.appendChild(current_conf);

for (var _player in Players) {
  var div = document.createElement("div");
  div.innerHTML = `${_player}: `;
  for (var ver in Players[_player]["versions"]) {
    var same_ver = Players[_player]["versions"][ver] == player_ver;
    var ver_link = document.createElement("span");
    ver_link.classList.add("leftmargin15");

    if ((!same_ver && _player == player_type) || player_type != _player) {
      ver_link.classList.add("focusable");
      ver_link.setAttribute("tabindex", "0");
      ver_link.setAttribute(
        "data-href",
        `?player=${_player}&player_ver=${Players[_player]["versions"][ver]}&url=${media_url}`
      );
      ver_link.onclick = window.navigate;
      ver_link.innerHTML = Players[_player]["versions"][ver];
    } else {
      ver_link.classList.add("orange");
      ver_link.innerHTML = Players[_player]["versions"][ver];
    }
    div.appendChild(ver_link);
  }
  div_player.appendChild(div);
}

init_player(player_type);
