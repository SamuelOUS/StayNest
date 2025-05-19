// features/support/hooks.ts

import { Before, After } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { chromium, Browser, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;

Before(async () => {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();

  actorCalled('User').whoCan(
    BrowseTheWebWithPlaywright.using(browser));
});

After(async () => {
  await context?.close();
  await browser?.close();
});
