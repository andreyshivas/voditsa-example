export default function (context) {
  const userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent;
  if (process.server) {
    console.log('url: ', context.route.fullPath, '| UA: ', userAgent);
  }
}
