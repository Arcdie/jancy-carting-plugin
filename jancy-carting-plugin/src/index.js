module.exports = {
  jancy_props: {
    registryVersion: 1
  },

  jancy_onInit(jancy) {
    jancy.actionRegistry.register('carting:tab:open', cartingTabOpenedHandler);
  },
}

const cartingTabOpenedHandler = ({ tabId, detail: { uri, cookieStore } }) => {
  const tab = jancy.tabManager.getTab({ uuid: tabId });
  const partition = jancy.partitions.getPartition(tab.partitionId);

  const newCookies = cookieStore.cookies.map(setCookie);

  jancy.partitions.addCookies(partition, newCookies)
    .then(navigate.bind(null, tab, uri));
};

const navigate = (tab, uri) => jancy.tabManager.navigateTab(tab, {
  url: uri,
  mode: 'url',
});

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
