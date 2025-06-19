module.exports = {
    preset: 'ts-jest',
    //testEnvironment: './jest.env.ts',
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.setup.ts'],
    testMatch: ['**/*.test.(js|ts|tsx)'],
    silent: false,
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};