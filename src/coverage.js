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

const streamingTypes = {
  dash: { containers: ["cmaf", "fmp4", "webm"], codecs: Profiles.all.codecs },
  hls: { containers: ["cmaf", "fmp4", "mpeg2ts"], codecs: ["avc", "hevc", "aac", "ac3", "eac3", "mp3"] },
  hss: { containers: ["fmp4"], codecs: ["avc", "hevc", "aac", "mp3"] },
  progressive: { containers: ["mp4", "mp3", "mkv"], codecs: Profiles.all.codecs },
};
const subtitlesTypes = ["track-tag-webvtt", "webvtt", "ttml"];
const customContainers = {
  webm: ["vp9", "opus", "com.microsoft.playready"],
  mp3: ["mp3"],
};
const niceNames = {
  "com.microsoft.playready": "PlayReady",
  "track-tag-webvtt": "out-of-band WebVTT",
  webvtt: "WebVTT",
};

const unsupportedColor = "#fffae5";
const noContentColor = "#ffebe5";
const someContentColor = "#e3fcef";

function createAndAdd(parent, tag, content) {
  let child = document.createElement(tag);
  if (content) {
    let text = document.createTextNode(content);
    child.appendChild(text);
  }
  parent.appendChild(child);
  return child;
}

function setCoverageHeader(coverageDiv) {
  coverageDiv.innerHTML =
    "<p>Coverage report for profile: " +
    SelectedProfile.note +
    '</p>\
  <p>This lists how many pieces of test content exist, not if the content pass or fail.</p>\
  <table><tr>\
  <td style="background-color:' +
    unsupportedColor +
    '">Unsupported</td>\
  <td style="background-color:' +
    noContentColor +
    '">Supported, No Content</td>\
  <td style="background-color:' +
    someContentColor +
    '">Supported and number of tests</td>\
  </tr></table>';
}

function addProfileSelector(coverageDiv) {
  let profilesSpan = util.createElement("span", "profilesSpan", "rightmargin20", "Profile: ");
  coverageDiv.appendChild(profilesSpan);
  Object.keys(Profiles).forEach((profileId) => {
    let span = util.createElement("span", profileId, "rightmargin20", profileId);
    span.setAttribute("tabindex", "0");
    if (SelectedProfile === Profiles[profileId]) {
      span.classList.add("bold");
    } else {
      span.classList.add("focusable");
      let queryParams = new URLSearchParams(window.location.search);
      queryParams.set("profile", profileId);
      let url = `${location.origin}${location.pathname}?` + queryParams.toString();
      span.setAttribute("data-href", url);
      span.onclick = window.navigate;
    }
    profilesSpan.appendChild(span);
  });
}

function getVariantTests(variant) {
  let tests = [];
  for (let suiteName in window.testSuiteDescriptions) {
    if (!window.testSuiteDescriptions[suiteName].tests) continue;
    let suiteTests = window.testSuiteDescriptions[suiteName].tests().tests;
    for (let test of suiteTests) {
      if (test.prototype.content.variant === variant) tests.push(test);
    }
  }
  return tests;
}

function countTests(attribute, tests, container, engine) {
  let numOfTests = 0;
  if (
    customContainers[container] &&
    !subtitlesTypes.includes(attribute) &&
    !customContainers[container].includes(attribute)
  )
    return -1;

  for (let test of tests) {
    const content = test.prototype.content;
    if (content.container !== container || test.prototype.engine !== engine) continue;
    else if (content.video && content.video.codec === attribute) numOfTests += 1;
    else if (content.audio && content.audio.codec === attribute) numOfTests += 1;
    else if (content.drm && content.drm.servers[attribute]) numOfTests += 1;
    else if (content.subtitles && content.subtitles.format === attribute) numOfTests += 1;
  }
  return numOfTests;
}

function generateCoverage() {
  let coverageDiv = document.getElementById("coverage");
  setCoverageHeader(coverageDiv);
  addProfileSelector(coverageDiv);

  let coverage = createAndAdd(coverageDiv, "div");
  coverage.classList.add("coverage");
  for (const streamingName in streamingTypes) {
    const streamingType = streamingTypes[streamingName];

    let top = createAndAdd(coverage, "div");
    top.appendChild(util.createElement("h1", streamingName, "focusable", streamingName));
    let table = util.createElement("table", streamingName + "_table", "coverage_table");
    top.appendChild(table);
    let firstHeader = createAndAdd(table, "tr");
    let secondHeader = createAndAdd(table, "tr");

    createAndAdd(firstHeader, "th", "Container");
    createAndAdd(secondHeader, "th", "");
    createAndAdd(firstHeader, "th", "Player");
    createAndAdd(secondHeader, "th", "");

    function addColumn(name, codecs) {
      if (codecs.length != 0) {
        let col = createAndAdd(firstHeader, "th", name);
        col.colSpan = codecs.length;
      }
    }
    const codecs = SelectedProfile.codecs.filter((codec) => streamingType.codecs.includes(codec));
    const drms = streamingName === "progressive" ? [] : SelectedProfile.drm;
    addColumn("Codecs", codecs);
    addColumn("DRM", drms);
    addColumn("Subtitles", subtitlesTypes);

    const attributes = [...codecs, ...drms, ...subtitlesTypes];
    attributes.forEach((attribute) => {
      let element = createAndAdd(secondHeader, "th", "");
      if (niceNames[attribute]) {
        element.innerText = niceNames[attribute];
      } else {
        element.innerText = attribute;
        element.style["text-transform"] = "uppercase";
      }
    });

    for (const container of streamingType.containers) {
      for (const engineName in EngineProperties) {
        const engine = EngineProperties[engineName];
        if (!engine.variants.includes(streamingName)) continue;
        let row = createAndAdd(table, "tr");
        createAndAdd(row, "td", container);
        createAndAdd(row, "td", engineName);

        let variantTets = getVariantTests(streamingName);
        attributes.forEach((attribute) => {
          let count = countTests(attribute, variantTets, container, engineName);
          let td = document.createElement("td");
          if (count === -1) {
            td.style["background-color"] = unsupportedColor;
            count = 0;
          } else if (count === 0) {
            td.style["background-color"] = noContentColor;
          } else {
            td.style["background-color"] = someContentColor;
          }
          td.innerText = count;
          row.appendChild(td);
        });
      }
    }
  }
}
