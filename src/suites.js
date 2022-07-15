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

/*
 * This file declares test suites, which can be selected from main UI or via |test_type| URL parameter.
 * The final test suite name and content is generated by the |makeTests| function.
 * Suite's tests subset depends on selected profile (see profiles.js).
 */

"use strict";

function makeMvtMediaTests(testTemplate, engine, streams) {
  let tests = [];
  streams.forEach((stream) => {
    tests.push(new MvtMediaTest(testTemplate, stream, engine));
  });
  return tests;
}

// DASH Shaka
(function () {
  let shaka = new ShakaEngine();

  let commonStreams = StreamSets.DASH.Common.concat(StreamSets.DASH.DRM);
  let mvtTests = makeMvtMediaTests(testPlayback, shaka, commonStreams);
  // TODO (ONEM-26308) Restore testPause for all suites once WebKit bug is fixed
  // mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, shaka, commonStreams));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, shaka, commonStreams));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, shaka));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, shaka, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH Shaka", makeTests(mvtTests));
})();

// DASH dashjs
(function () {
  let dashjs = new DashjsEngine();

  let commonStreams = StreamSets.DASH.Common.concat(StreamSets.DASH.DRM);
  let mvtTests = makeMvtMediaTests(testPlayback, dashjs, commonStreams);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, dashjs, commonStreams));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, dashjs));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, dashjs, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH dashjs", makeTests(mvtTests));
})();

// DASH html5
(function () {
  let html5Engine = new Html5Engine();

  let mvtTests = makeMvtMediaTests(testPlayback, html5Engine, StreamSets.DASH.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, html5Engine, StreamSets.DASH.Common));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, html5Engine));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, html5Engine, StreamSets.DASH.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH html5", makeTests(mvtTests));
})();

// HLS Shaka
(function () {
  let shaka = new ShakaEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, shaka, StreamSets.HLS.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, shaka, StreamSets.HLS.Common));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, shaka));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, shaka, StreamSets.HLS.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HLS Shaka", makeTests(mvtTests));
})();

// HLS hlsjs
(function () {
  let shaka = new HlsjsEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, shaka, StreamSets.HLS.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, shaka, StreamSets.HLS.Common));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, shaka));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, shaka, StreamSets.HLS.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HLS hlsjs", makeTests(mvtTests));
})();

// HSS html5
(function () {
  let html5Engine = new Html5Engine();

  let mvtTests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, html5Engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, html5Engine),
    new MvtMediaTest(testSubtitles, MS.HSS.FMP4_AVC_AAC_VTT, html5Engine),
  ];

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("HSS html5", makeTests(mvtTests));
})();

// HSS dashjs
(function () {
  let dashjs = new DashjsEngine();

  let mvtTests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, dashjs),
    new MvtMediaTest(testPlayback, MS.HSS.PLAYREADY_2_0, dashjs),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, dashjs),
    new MvtMediaTest(testSetPosition, MS.HSS.PLAYREADY_2_0, dashjs),
  ];

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH dashjs", makeTests(mvtTests));
})();

// Progressive html5
(function () {
  let html5Engine = new Html5Engine();

  let mvtTests = makeMvtMediaTests(testPlayback, html5Engine, StreamSets.Progressive.Common);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, html5Engine, StreamSets.Progressive.Common));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, html5Engine, StreamSets.Progressive.Subtitles));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("Progressive html5", makeTests(mvtTests));
})();
