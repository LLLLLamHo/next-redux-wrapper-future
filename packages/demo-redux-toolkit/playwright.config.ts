import {PlaywrightTestConfig} from '@playwright/test';
import defaultConfig from 'next-redux-wrapper-future-configs/playwright';

const config: PlaywrightTestConfig = {
    ...defaultConfig,
    webServer: {
        ...defaultConfig.webServer,
        port: 6060,
    },
};

export default config;
