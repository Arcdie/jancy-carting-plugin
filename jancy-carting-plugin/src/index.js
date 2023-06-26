module.exports = {
  jancy_props: {
    registryVersion: 1
  },

  jancy_onInit(jancy) {
    jancy.actionRegistry.register('carting:tab:open', cartingTabOpenedHandler);
  },
}

const cartingTabOpenedHandler = async ({ detail: { uri, cookieStore } }) => {
  const newCookies = cookieStore.cookies.map(setCookie);

  const tab = await jancy.tabManager.createTab();
  jancy.console.log('jancy.tabManager.createTab completed successfully (1 / 6)');

  const partition = jancy.partitions.getPartition(tab.partitionId);
  jancy.console.log('jancy.partitions.getPartition completed successfully (2 / 6)');

  const window = jancy.windowManager.getWindow({ which: 'focused' });
  jancy.console.log('jancy.windowManager.getWindow completed successfully (3 / 6)');

  await setTabsForWindow(window, [tab]);
  jancy.console.log('setTabsForWindow completed successfully (4 / 6)');

  await setCookiesForPartition(partition, newCookies);
  jancy.console.log('setCookiesForPartition completed successfully (5 / 6)');

  await navigate(tab, uri);
  jancy.console.log('navigate completed successfully (6 / 6)');
};

const navigate = (tab, url) => jancy.tabManager.navigateTab(tab, { url, mode: 'url' });

const setTabsForWindow = (window, tabs) =>
  new Promise(res => jancy.tabManager.launchTabs(window, tabs, {}).then(setTimeout(res, 300)));

const setCookiesForPartition = (partition, cookies) => jancy.partitions.addCookies(partition, cookies);

const setCookie = cookie => jancy.partitions.makeCookie({
  name: cookie.name || cookie.key,
  path: cookie.path,
  value: cookie.value,
  secure: cookie.secure,
  url: toURL(cookie.domain),
  domain: toDomain(cookie.domain),
});

const toURL = (domain) => `https://${domain}`;

const toDomain = (domain) => {
  const isSubDomain = domain.split('.').length >= 3;
  return isSubDomain ? domain : `.${domain}`;
};
