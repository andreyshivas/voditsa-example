const loadProducts = async (path, cache, query, api) => {
  const filtersObject = {};
  const page = query.page ? query.page : 1;
  const sort = query.sort ? query.sort : 'first_published_at:desc';
  let filtersSlugs = [];

  for (let key in query) {
    if (key === 'brand') {
      filtersSlugs.push(`brands/${query[key]}`);
    }  else if (key !== 'page' && key !== 'sort') {
      filtersSlugs.push(`filters/${key}/${query[key]}`);
    }
  }

  filtersSlugs = filtersSlugs.join(',');

  const filtersData = await api.get(`cdn/stories/`, {
    version: 'published',
    cv: cache,
    by_slugs: filtersSlugs,
  });

  const filters = filtersData.data.stories;

  const getFiltersIds = (slugs, filters) => {
    let filtersIds = [];
    slugs.split(',').forEach((slug) => {
      filters.forEach((item) => {
        if (item.slug === slug) {
          filtersIds.push(item.uuid);
        }
      })
    });

    return filtersIds.join(',');
  };

  for (let key in query) {
    const value = key.split('-').join('_');
    if (value === 'brand') {
      filtersObject[value] = {
        in: getFiltersIds(query[key], filters)
      };
    } else if (value !== 'page' && value !== 'sort') {
      filtersObject[value] = {
        any_in_array: getFiltersIds(query[key], filters)
      };
    }
  }

  const fetchOptions = {
    starts_with: query.category ? `catalog/${query.category}/` : path,
    filter_query: {
      component: {
        in: 'product',
      },
      ...filtersObject,
    }
  }

  const products = await api.get(`cdn/stories/`, {
    version: 'published',
    cv: cache,
    sort_by: sort,
    excluding_fields: 'text,meta,body',
    per_page: 12,
    page: page,
    ...fetchOptions,
  })

  return {
    products: products.data.stories,
    currentPage: page,
    totalProducts: products.total,
    totalPages: Math.ceil(products.total / products.perPage),
  }
}

export { loadProducts }
