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

const CommonDashStreams = [
  MS.DASH.FMP4_AVC_AAC,
  MS.DASH.FMP4_AVC_AC3,
  MS.DASH.FMP4_HEVC_EAC3,
  MS.DASH.FMP4_MPEG2_MP3,
  MS.DASH.MULTIPERIOD,
  MS.DASH.PLAYREADY_2_0,
  MS.DASH.FMP4_MP3,
  MS.DASH.WEBM_VP9_OPUS,
  MS.DASH.CMAF_HEVC_AAC,
  MS.DASH.DYNAMIC,
  MS.DASH.CMAF_AVC_AC3,
  MS.DASH.CMAF_HEVC_EAC3,
  MS.DASH.CMAF_AVC_MP3_VTT,
];

const SubtitlesDashStreams = [MS.DASH.FMP4_AVC_AAC_TTML, MS.DASH.WEBM_VP9_OPUS_VTT, MS.DASH.CMAF_AVC_MP3_VTT];

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

  let mvtTests = makeMvtMediaTests(testPlayback, shaka, CommonDashStreams);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, shaka, CommonDashStreams));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, shaka, CommonDashStreams));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, shaka));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, shaka, SubtitlesDashStreams));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH Shaka", makeTests(mvtTests));
})();

// DASH dashjs
(function () {
  let dashjs = new DashjsEngine();

  let mvtTests = makeMvtMediaTests(testPlayback, dashjs, CommonDashStreams);
  mvtTests = mvtTests.concat(makeMvtMediaTests(testPause, dashjs, CommonDashStreams));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSetPosition, dashjs, CommonDashStreams));
  mvtTests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, dashjs));
  mvtTests = mvtTests.concat(makeMvtMediaTests(testSubtitles, dashjs, SubtitlesDashStreams));

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH dashjs", makeTests(mvtTests));
})();
