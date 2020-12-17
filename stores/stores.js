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
]);