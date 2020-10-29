import { derived, readable, writable } from 'svelte/store';

export const message = writable("starting...");

export const activeDevice = writable(0);
export const devices = writable([]);

// export const stichables = writable([]);

export const block0_31 = writable([0,0,0,0]);
export const block32_63 = writable([0,0,0,0]);
export const block64_95 = writable([0,0,0,0]);
export const block96_127 = writable([0,0,0,0]);

export const single_pulse_block = writable([0, 0, 0, 0]);
export const hf_block = writable([0, 0, 0, 0]);
export const lf_block = writable([0, 0, 0, 0]);

export const act_command = derived([devices, activeDevice, block0_31, block32_63, block64_95, block96_127, single_pulse_block, hf_block, lf_block],
    ([$devices, $activeDevice, $block0_31, $block32_63, $block64_95, $block96_127, $single_pulse_block, $hf_block, $lf_block]) => `{ "ActuatorsCommand": {
    "fabric_name": "${$devices[$activeDevice]}",
    "op_mode_block": {"act_cnt32":2, "act_mode":0, "op_mode":2},
    "actuator_mode_blocks": {
      "block0_31":{"b0": ${$block0_31[0]}, "b1": ${$block0_31[1]}, "b2": ${$block0_31[2]}, "b3": ${$block0_31[3]}},
      "block32_63":{"b0": ${$block32_63[0]}, "b1": ${$block32_63[1]}, "b2": ${$block32_63[2]}, "b3": ${$block32_63[3]}},
      "block64_95":{"b0": ${$block64_95[0]}, "b1": ${$block64_95[1]}, "b2": ${$block64_95[2]}, "b3": ${$block64_95[3]}},
      "block96_127":{"b0": ${$block96_127[0]}, "b1": ${$block96_127[1]}, "b2": ${$block96_127[2]}, "b3": ${$block96_127[3]}}},
    "timer_mode_blocks": {
      "single_pulse_block":{"b0":${$single_pulse_block[0]}, "b1":${$single_pulse_block[1]}, "b2":${$single_pulse_block[2]}, "b3":${$single_pulse_block[3]}},
      "hf_block":{"b0":${$hf_block[0]}, "b1":${$hf_block[1]}, "b2":${$hf_block[2]}, "b3":${$hf_block[3]}},
      "lf_block":{"b0":${$lf_block[0]}, "b1":${$lf_block[1]}, "b2":${$lf_block[2]}, "b3":${$lf_block[3]}}
    } } }`);
