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

AllHardwareConfigs["default"] = {
  hardware: "default",
  codecs: {
    mp2: {
      codec: "mpeg2",
      can_check: false,
      resolution: [1920, 1080, 30],
      note: "Main Profile at High Level (ISO/IEC 13818-2)",
    },
    avc1: {
      codec: "avc1.64002a",
      resolution: [1920, 1088, 60],
      note: "Main and High Profiles (ISO 14496-10) up to Level 4.2 up to 1920x1088 at 60 fps",
    },
    hevc: {
      codec: "hvc1.2.4.L153.00",
      resolution: [4096, 2176, 60],
      note: "Standard Main and/or Main10 Profiles Level 4.1, 5.0 and 5.1 up to 4096x2176 at 60 fps",
    },
    vp9: {
      codec: "vp09.02.51.08",
      note: "Profile 0 and Profile 2 up to 4096x2176 at 60 fps (Level 5.1)",
    },

    aac: {
      codec: "mp4a.40.29",
      channels: "5.1",
      note: "AAC-LC (Supported), HE-AAC (Supported (level 4))",
    },
    mp3: {
      codec: "mp4a.69",
      channels: "2",
      note2: "Does mp3 support more than 2 channels?",
      note: "Supported",
    },
    ac3: {
      codec: "mp4a.a5",
      channels: "5.1",
      note: "MS12, max 5.1",
    },
    eac3: {
      codec: "mp4a.a6",
      channels: "7.1",
      note: "MS12, max 7.1",
    },
    opus: {
      codec: "opus",
      channels: 2,
      note: "2 channel, in mp4 this is mp4a.ad",
      codecMime: { webm: "opus", mp4: "mp4a.ad" },
    },
  },
};
