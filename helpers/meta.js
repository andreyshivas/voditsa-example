export default function meta(data, image, context) {
  const meta = [];
  const url = context.$route.path;
  const query = context.$route.query;
  const title = data?.title ? data.title : 'Voditsa.by - интернет-магазин корейской косметики в Минске.';
  const description = data?.description ? data.description : 'Купить корейскую косметику на сайте «Voditsa.by». ⭐ Уходовая, натуральная, корейская косметика. Доставка по Минску и Беларуси. ⭐ Распродажи, акции и скидки до 50%.';
  const canonical = context.$config.siteURL + url.replace(/\/$/, '');

  if (Object.keys(query).length > 0) {
    meta.push({
      hid: 'robots',
      name: 'robots',
      content: 'nofollow, noindex',
    })
  }

  meta.push({
    hid: 'title',
    name: 'title',
    content: title,
  })
  meta.push({
    hid: 'og:title',
    property: 'og:title',
    content: title,
  })
  meta.push({
    hid: 'twitter:title',
    property: 'twitter:title',
    content: title,
  })
  meta.push({
    hid: 'description',
    name: 'description',
    content: description,
  })
  meta.push({
    hid: 'og:description',
    property: 'og:description',
    content: description,
  })
  meta.push({
    hid: 'twitter:description',
    property: 'twitter:description',
    content: description,
  })
  meta.push({
    hid: 'og:image',
    property: 'og:image',
    content: image ? image : `${context.$config.siteURL}/images/img-share.png`
  })
  meta.push({
    hid: 'vk:image',
    property: 'vk:image',
    content: image ? image : `${context.$config.siteURL}/images/img-share.png`
  })
  meta.push({
    hid: 'twitter:image',
    property: 'twitter:image',
    content: image ? image : `${context.$config.siteURL}/images/img-share.png`
  })
  meta.push({
    hid: 'image',
    itemprop: 'image',
    content: image ? image : `${context.$config.siteURL}/images/img-share.png`
  })
  meta.push({
    hid: 'og:url',
    property: 'og:url',
    content: `${context.$config.siteURL}${url}`
  })
  meta.push({
    hid: 'twitter:url',
    property: 'twitter:url',
    content: `${context.$config.siteURL}${url}`
  })
  return {
    htmlAttrs: {
      lang: 'ru-RU'
    },
    title: title,
    link: [
      { rel: 'canonical', href: canonical },
    ],
    meta: meta
  }
}
