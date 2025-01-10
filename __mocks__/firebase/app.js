const mockInitializeApp = jest.fn(() => ({}));
const mockGetApps = jest.fn().mockReturnValue([]);
const mockGetApp = jest.fn(() => ({}));

module.exports = {
  initializeApp: mockInitializeApp,
  getApps: mockGetApps,
  getApp: mockGetApp
};
