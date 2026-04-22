import {runInspectionBatch} from '../runInspectionBatch';
import {InspectionFormData} from '../types';

describe('runInspectionBatch', () => {
  it('runs full inspection flow', async () => {
    const driver = {
      startFlow: jest.fn(),
      handleExternalInput: jest.fn(),
    } as any;

    const data: InspectionFormData = {
      strength: 10,
      broodFrames: 5,
      queen: 'так',
      queenBreed: 'карніка',
      queenYear: 2024,
      honeyKg: 20,
    };
    await runInspectionBatch(driver, 1, data);

    expect(driver.startFlow).toHaveBeenCalledWith('inspection', 1);

    expect(driver.handleExternalInput).toHaveBeenCalledTimes(8);
  });
});
