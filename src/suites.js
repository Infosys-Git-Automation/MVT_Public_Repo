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
 * Suite's tests subset depends on selected profile (see profiles.js::filterUnsupportedOnProfile).
 */

"use strict";

function makeMvtMediaTests(testTemplate, engine, streams, Unstable = null, timeout = TestBase.timeout) {
  let tests = [];
  streams.forEach((stream) => {
    tests.push(new MvtMediaTest(testTemplate, stream, engine, Unstable, timeout));
  });
  return tests;
}

(function () {
  const testSuite = "DASH Shaka";
  let engine = new ShakaEngine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine, new Unstable("ONEM-26279")));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH dashjs";
  let engine = new DashjsEngine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.CommonAndDRM);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.CommonAndDRM));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "DASH html5";
  let engine = new Html5Engine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.DASH.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.DASH.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.DASH.Common));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.DASH.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.DASH.MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.DASH.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS Shaka";
  let engine = new ShakaEngine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HLS hlsjs";
  let engine = new HlsjsEngine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.HLS.Common);
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.HLS.Common));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.HLS.Common));
  // TODO: ONEM-26268 Fix Rate tests
  tests = tests.concat(makeMvtMediaTests(testPlayRate, engine, StreamSets.HLS.Video, new Unstable("ONEM-26268")));
  tests.push(new MvtMediaTest(testChangeAudioTracks, MS.HLS.FMP4_MULTIAUDIO, engine));
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.HLS.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HSS html5";
  let engine = new Html5Engine();

  let tests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, new Unstable("ONEM-26268")),
    new MvtMediaTest(testSubtitles, MS.HSS.FMP4_AVC_AAC_VTT, engine),
  ];

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "HSS dashjs";
  let engine = new DashjsEngine();

  let tests = [
    new MvtMediaTest(testPlayback, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPlayback, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testPause, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testPause, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.FMP4_AVC_AAC_VTT, engine),
    new MvtMediaTest(testSetPosition, MS.HSS.PLAYREADY_2_0, engine),
    new MvtMediaTest(testPlayRate, MS.HSS.FMP4_AVC_AAC_VTT, engine, new Unstable("ONEM-26268")),
    new MvtMediaTest(testPlayRate, MS.HSS.PLAYREADY_2_0, engine, new Unstable("ONEM-26268")),
  ];

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();

(function () {
  const testSuite = "Progressive html5";
  let engine = new Html5Engine();

  let tests = makeMvtMediaTests(testPlayback, engine, StreamSets.Progressive.Common);
  tests.push(new MvtMediaTest(testPlayback, MS.PROG.MKV_EAC3, engine));
  tests = tests.concat(makeMvtMediaTests(testPause, engine, StreamSets.Progressive.Common, new Unstable("ONEM-?????")));
  tests.push(new MvtMediaTest(testPause, MS.PROG.MKV_EAC3, engine, new Unstable("ONEM-?????")));
  tests = tests.concat(makeMvtMediaTests(testSetPosition, engine, StreamSets.Progressive.Common));
  tests.push(new MvtMediaTest(testSetPosition, MS.PROG.MKV_EAC3, engine, new Unstable("ONEM-26126")));
  tests = tests.concat(
    makeMvtMediaTests(testPlayRate, engine, StreamSets.Progressive.Video, new Unstable("ONEM-26268"))
  );
  tests = tests.concat(makeMvtMediaTests(testSubtitles, engine, StreamSets.Progressive.Subtitles));

  tests = filterUnsupportedOnProfile(SelectedProfile, tests);

  registerTestSuite(testSuite, makeTests(tests));
})();
