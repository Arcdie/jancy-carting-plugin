module.exports = {
  jancy_props: {
    registryVersion: 1
  },

  jancy_onInit(jancy) {
    jancy.actionRegistry.register('carting:tab:open', cartingTabOpenedHandler);
  },
}

const cartingTabOpenedHandler = async ({ detail: { uri, cookieStore } }) => {
  const tab = await jancy.tabManager.createTab();
  const partition = jancy.partitions.getPartition(tab.partitionId);
  const newCookies = cookieStore.cookies.map(setCookie);
  const window = jancy.windowManager.getWindow({ which: 'focused' });

  await setTabsForWindow(window, [tab]);
  await setCookiesForPartition(partition, newCookies);
  await navigate(tab, uri);
};

const navigate = (tab, url) => jancy.tabManager.navigateTab(tab, { url, mode: 'url' });

const setTabsForWindow = (window, tabs) => jancy.tabManager.launchTabs(window, tabs, {});

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
