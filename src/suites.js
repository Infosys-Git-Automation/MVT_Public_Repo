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

(function () {
  let shaka = new ShakaEngine();

  let mvtTests = [
    new MvtMediaTest(testPlayback, MS.DASH.FMP4_AVC_AAC, shaka),
    new MvtMediaTest(testPlayback, MS.DASH.FMP4_AVC_AC3, shaka),
    new MvtMediaTest(testPlayback, MS.DASH.FMP4_HEVC_EAC3, shaka),
    new MvtMediaTest(testPlayback, MS.DASH.FMP4_MPEG2_MP3, shaka),
    new MvtMediaTest(testPlayback, MS.DASH.MULTIPERIOD, shaka),
    new MvtMediaTest(testPlayback, MS.DASH.PLAYREADY_2_0, shaka),
    new MvtMediaTest(testSetPosition, MS.DASH.FMP4_AVC_AAC, shaka),
    new MvtMediaTest(testSubtitles, MS.DASH.FMP4_AVC_AAC_TTML, shaka),
  ];

  mvtTests = filterUnsupportedOnProfile(SelectedProfile, mvtTests);

  registerTestSuite("DASH Shaka", makeTests(mvtTests));
})();
