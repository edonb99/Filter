const getFacet = (facets, name) => {
  if (facets.length === 0) return [];

  const noFacets = ["on_sale", "images"];
  if (noFacets.includes(name)) return [];

  return facets[name][0].data.map((dt) => String(dt.value));
};

export { getFacet };
