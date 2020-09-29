import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, getByTestId } from '@testing-library/svelte'
import Manual from '../routes/Manual.svelte'

const groundTruth = [
    'Test: 00000001,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000010,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000100,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00001000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00010000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00100000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 01000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 10000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000001,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000010,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000100,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00001000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00010000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00100000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,01000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,10000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000001,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000010,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000100,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00001000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00010000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00100000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,01000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,10000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000001, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000010, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000100, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00001000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00010000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00100000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,01000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,10000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000001,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000010,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000100,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00001000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00010000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00100000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 01000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 10000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000001,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000010,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000100,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00001000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00010000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00100000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,01000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,10000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000001,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000010,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000100,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00001000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00010000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00100000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,01000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,10000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000001, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000010, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000100, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00001000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00010000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00100000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,01000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,10000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000001,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000010,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000100,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00001000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00010000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00100000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 01000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 10000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000001,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000010,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000100,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00001000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00010000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00100000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,01000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,10000000,00000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000001,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000010,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000100,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00001000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00010000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00100000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,01000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,10000000,00000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000001, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000010, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000100, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00001000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00010000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00100000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,01000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,10000000, 00000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000001,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000010,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000100,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00001000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00010000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00100000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 01000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 10000000,00000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000001,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000010,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000100,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00001000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00010000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00100000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,01000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,10000000,00000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000001,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000010,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000100,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00001000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00010000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00100000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,01000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,10000000,00000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000001',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000010',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000100',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00001000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00010000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00100000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,01000000',
    'Test: 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,00000000, 00000000,00000000,00000000,10000000',
];


test('Sends correct Actuator command',async () => {
    const { getByText } = render(Manual,{test_ui: true})
    // Set output to watch
    const output = getByText('Test: 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0')
    //Loop through all actuators
    for (let index = 0; index < 36; index++) {
        const button = getByText('Button ' + index.toString())
        await fireEvent.click(button)
        expect(output).toHaveTextContent(groundTruth[index])
    }

})