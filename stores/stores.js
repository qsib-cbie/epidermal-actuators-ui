import { derived, readable, writable } from 'svelte/store';

export const message = writable("starting...");

export const command = writable(0x02); //Sets timing options (alloff, single pulse,...)
export const cmd_op = writable(0x01);
export const act_cnt8 = writable(5);

export const hostname = writable("localhost");
export const port = writable("8088");
export const route = writable("api_index");
export const endpoint = derived([hostname, port, route], ([$hostname, $port, $route]) => `http://${$hostname}:${$port}/${$route}`);

export const activeDevice = writable(0);
export const devices = writable([]);

export const is_success = writable(false);
export const is_connected = writable(false);

export const block0_31 = writable([0,0,0,0]);
export const block32_63 = writable([0,0,0,0]);
export const block64_95 = writable([0,0,0,0]);
export const block96_127 = writable([0,0,0,0]);

export const lfPeriod = writable(2000);
export const lfDutyCycle = writable(50);
export const hfPeriod = writable(200);
export const hfDutyCycle = writable(50);
export const single_pulse_duration = writable(1000);
export const single_pulse_pause = writable(250);

export const single_pulse_block = writable([0, 0, 0]);
export const hf_block = writable([0, 0, 0]);
export const lf_block = writable([0, 0, 0]);

export const act_command = derived([command, act_cnt8, cmd_op, devices, activeDevice, block0_31, block32_63, block64_95, block96_127, single_pulse_block, hf_block, lf_block],
  ([$command, $act_cnt8, $cmd_op, $devices, $activeDevice, $block0_31, $block32_63, $block64_95, $block96_127, $single_pulse_block, $hf_block, $lf_block]) => `{ "ActuatorsCommand": {
    "fabric_name": "${$devices[$activeDevice]}",
    "op_mode_block": {"act_cnt8":${$act_cnt8}, "cmd_op":${$cmd_op}, "command":${$command}},
    "actuator_mode_blocks": {
      "block0_31":{"b0": ${$block0_31[0]}, "b1": ${$block0_31[1]}, "b2": ${$block0_31[2]}, "b3": ${$block0_31[3]}},
      "block32_63":{"b0": ${$block32_63[0]}, "b1": ${$block32_63[1]}, "b2": ${$block32_63[2]}, "b3": ${$block32_63[3]}},
      "block64_95":{"b0": ${$block64_95[0]}, "b1": ${$block64_95[1]}, "b2": ${$block64_95[2]}, "b3": ${$block64_95[3]}},
      "block96_127":{"b0": ${$block96_127[0]}, "b1": ${$block96_127[1]}, "b2": ${$block96_127[2]}, "b3": ${$block96_127[3]}}},
    "timer_mode_blocks": {
      "single_pulse_block":{"b0":${$single_pulse_block[0]}, "b1":${$single_pulse_block[1]}, "b2":${$single_pulse_block[2]}},
      "hf_block":{"b0":${$hf_block[0]}, "b1":${$hf_block[1]}, "b2":${$hf_block[2]}},
      "lf_block":{"b0":${$lf_block[0]}, "b1":${$lf_block[1]}, "b2":${$lf_block[2]}}
    } } }`);


export const preset_display = readable([
  { name: "flashall", 
    array: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]]},
  { name: "sweep-TB",
    array: [[0, 1, 2, 3], [4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20], [21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31], [32, 33, 34, 35]]},
  { name: "sweep-BT",
    array: [[32, 33, 34, 35], [26, 27, 28, 29, 30, 31], [21, 22, 23, 24, 25], [15, 16, 17, 18, 19, 20], [10, 11, 12, 13, 14], [4, 5, 6, 7, 8, 9], [0, 1, 2, 3]]},
  { name: "sweep-RL",
    array: [[9, 20, 31], [3, 14, 25, 35], [8, 19, 30], [2, 13, 24, 34], [7, 18, 29], [12, 23], [6, 17, 28], [1, 11, 22, 33], [5, 16, 27], [0, 10, 21, 32], [26, 4, 15]]},
  { name: "sweep-LR",
    array: [[26, 4, 15], [0, 10, 21, 32], [5, 16, 27], [1, 11, 22, 33], [6, 17, 28], [12, 23], [7, 18, 29], [2, 13, 24, 34], [8, 19, 30], [3, 14, 25, 35], [9, 20, 31]],},
  { name: "sweep-45TB",
    array: [[0, 4], [1, 5, 10, 15], [6, 11, 16, 21, 26], [7, 2, 12, 17, 22, 27, 32], [33, 28, 23, 18, 8, 3, 13], [29, 24, 19, 14, 9], [34, 30, 25, 20], [35, 31]]},
  { name: "sweep-45BT",
    array: [[35, 31], [34, 30, 25, 20], [29, 24, 19, 14, 9], [33, 28, 23, 18, 8, 3, 13], [7, 2, 12, 17, 22, 27, 32], [6, 11, 16, 21, 26], [1, 5, 10, 15], [0, 4]]},
  { name: "sweep+45TB",
    array: [[3, 9], [20, 14, 8, 2], [31, 25, 19, 13, 7], [1, 6, 12, 18, 24, 30, 35], [34, 29, 17, 11, 23, 5, 0], [28, 22, 16, 10, 4], [33, 27, 21, 15], [32, 26]]},
  { name: "sweep+45BT",
    array: [[32, 26], [33, 27, 21, 15], [28, 22, 16, 10, 4], [34, 29, 17, 11, 23, 5, 0], [1, 6, 12, 18, 24, 30, 35], [31, 25, 19, 13, 7], [20, 14, 8, 2], [3, 9]]},
  { name: "hand-arrow-RL", 
    array: [[12, 9], [12, 9, 7, 6], [9, 7, 6, 3], [6, 3, 15, 2], [2, 4, 15, 16]]},
  { name: "hand-arrow-LR",
    array: [[17, 16], [17, 16, 18, 7], [16, 18, 7, 8], [7, 8, 9, 5], [2, 5, 9, 13]]},
  { name: "hand-arrow-TB",
    array: [[1, 2], [1, 2, 6, 18], [6, 18, 19, 2], [18, 19, 16, 10], [9, 10, 16, 14]]},
  { name: "hand-arrow-BT",
    array: [[18, 19], [18, 19, 2, 6], [2, 5, 6, 3], [5, 3, 8, 2]]},
  { name: "back-arrow-RL",
    array: [[18, 31], [18, 31, 34, 63], [34, 63, 65, 68], [65, 68, 69, 67], [67, 62, 69, 71], [58, 62, 70, 71]]},
  { name: "back-arrow-LR",
    array: [[61, 62], [61, 62, 64, 63], [64, 63, 39, 37], [39, 37, 36, 40], [40, 71, 36, 31], [74, 71, 28, 31]]},
  { name: "back-arrow-TB",
    array: [[26, 56], [26, 56, 59, 64], [59, 64, 65, 69], [69, 68, 65, 66], [68, 101, 66, 39], [100, 101, 36, 39]]},
  { name: "back-arrow-BT",
    array: [[74, 69], [74, 69, 65, 64], [65, 64, 59, 56], [59, 56, 58, 32], [61, 58, 30, 32], [61, 99, 30, 31]]},  
  { name: "chest-arrow-LR",
    array: [[60, 58], [60, 58, 59, 68], [59, 68, 69, 106], [69, 106, 66, 109], [66, 63, 109, 101], [101, 104, 63, 47]]},
  { name: "chest-arrow-RL",
    array: [[69, 68], [69, 68, 59, 58], [59, 58, 60, 84], [60, 84, 87, 55], [87, 92, 55, 52], [92, 93, 52, 39]]},
  { name: "chest-arrow-TB",
    array: [[43, 46], [43, 46, 38, 41], [38, 41, 56, 58], [56, 58, 59, 57], [59, 68, 57, 52], [52, 49, 68, 69]]},
  { name: "chest-arrow-BT",
    array: [[58, 56], [58, 56, 41, 38], [41, 38, 46, 43], [46, 43, 44, 20], [20, 19, 44, 48], [31, 19, 74, 48]]},  
  { name: "thigh-arrow-RL",
    array: [[20, 19], [20, 19, 24, 23], [19, 24, 23, 25], [23, 25, 26, 22], [26, 35, 22, 12], [35, 38, 12, 9]]},
  { name: "thigh-arrow-LR",
    array: [[25, 23], [25, 23, 24, 19], [23, 24, 19, 20], [20, 19, 16, 28], [16, 15, 28, 30], [15, 10, 30, 33]]},
  { name: "thigh-arrow-TB",
    array: [[5, 15], [5, 15, 18, 24], [18, 24, 27, 35], [27, 35, 26, 32], [32, 30, 26, 25]]},
  { name: "thigh-arrow-BT",
    array: [[35, 27], [35, 27, 24, 18], [24, 18, 15, 5], [15, 5, 14, 10], [10, 9, 14, 17]]},  
]);