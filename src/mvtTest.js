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

/**
 * This file overrides or redeclares stuff from js_mse_eme/harness/test.js
 * Implements tests generation and results gathering.
 */

"use strict";

var TestOutcome = {
  UNKNOWN: 0,
  PASSED: 1,
  FAILED: 2,
  OPTIONAL_FAILED: 3,
};

function getTestStatus(test) {
  if (test.prototype.outcome == TestOutcome.PASSED) return "passed";
  else if (test.prototype.outcome == TestOutcome.FAILED) return "failed";
  else return "skipped";
}

function getMvtTestResults(testStartId, testEndId) {
  testStartId = testStartId || 0;
  testEndId = testEndId || window.globalRunner.testList.length;

  var results = {
    name: harnessConfig.testType,
    setup_log: "",
    suites: [],
    teardown_log: "",
    tests: [],
    type: "suite_result",
    ver: "1.0",
  };

  for (var i = testStartId; i < testEndId; ++i) {
    if (window.globalRunner.testList[i]) {
      var test = window.globalRunner.testList[i];
      results["tests"].push({
        log: test.prototype.logs,
        name: test.prototype.name,
        status: getTestStatus(test),
        suites_chain: "MVT_SUITE." + harnessConfig.testType,
        time_ms: test.prototype.executionTime,
        type: "test_result",
        ver: "1.0",
      });
    }
  }
  return results;
}

window.testSuiteDescriptions = {};
window.testSuiteVersions = {
  [testVersion]: {
    testSuites: [],
    config: {
      enablewebm: true,
      controlMediaFormatSelection: false,
    },
  },
};

class TestTemplate {
  constructor(name, code) {
    this.testName = name;
    this.code = code;
  }
}

class MvtTest {
  constructor(testTemplate, mandatory = true, timeout = TestBase.timeout) {
    this.testTemplate = testTemplate;
    this.mandatory = mandatory;
    this.timeout = timeout;
  }
}

class MvtMediaTest extends MvtTest {
  constructor(testTemplate, stream, engine, mandatory = true, timeout = TestBase.timeout) {
    super(testTemplate, mandatory, timeout);
    this.stream = stream;
    this.engine = engine;
  }
}

function makeBasicTest(mvtTest) {
  let test = createTest(mvtTest.testTemplate.name, mvtTest.testTemplate.name, mvtTest.mandatory);
  test.prototype.timeout = mvtTest.timeout;
  test.prototype.onload = () => {
    mvtTest.testTemplate.code();
  };
  return test;
}

function makeMediaTest(mvtMediaTest) {
  let testName = mvtMediaTest.stream.name + " " + mvtMediaTest.testTemplate.testName;
  let test = createTest(testName, mvtMediaTest.testTemplate.testName, mvtMediaTest.mandatory);
  test.prototype.timeout = mvtMediaTest.timeout;
  test.prototype.onload = function (runner, video) {
    if (!test.prototype.playing) {
      test.prototype.playing = true;
      video.playbackRate = 1;
      video.play();
      mvtMediaTest.testTemplate.code.bind(this)(video, runner);
    }
  };
  test.prototype.content = mvtMediaTest.stream;
  mvtMediaTest.engine.setup(test, mvtMediaTest.stream);
  return test;
}

function makeTests(mvtTests) {
  let tests = [];
  mvtTests.forEach((t) => {
    if (t instanceof MvtMediaTest) {
      tests.push(makeMediaTest(t));
    } else {
      tests.push(makeBasicTest(t));
    }
  });
  return tests;
}

function registerTestSuite(name, tests) {
  if (tests.length === 0) return;
  let suiteKey = name.replace(" ", "-").toLowerCase() + "-test";
  let info = "Default Timeout: " + TestBase.timeout + "ms";
  let fields = ["passes", "failures", "timeouts"];
  tests.forEach((test, index) => {
    test.prototype.index = index;
  });
  let testSet = { tests: tests, info: info, fields: fields, viewType: "default" };

  var testSuiteDescription = {
    name: name + " Tests",
    title: name + " Tests",
    heading: name + " Tests",
    tests: () => testSet,
  };
  window.testSuiteDescriptions[suiteKey] = testSuiteDescription;
  window.testSuiteVersions[testVersion].testSuites.push(suiteKey);
}
