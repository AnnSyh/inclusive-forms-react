export default async function handler(req, res) {
  try {
    const { path = [] } = req.query;
    const backendBase = 'http://89.169.154.49:8000';
    const suffix = Array.isArray(path) ? path.join('/') : path;
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const url = `${backendBase}/${suffix}${qs}`;

    let body;
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = ct.includes('application/json') ? JSON.stringify(req.body ?? {}) : req.body;
    }

    const forwardHeaders = Object.fromEntries(
      Object.entries(req.headers).filter(([k]) =>
        !['host','content-length','connection','accept-encoding'].includes(k.toLowerCase())
      )
    );

    const resp = await fetch(url, {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual'
    });

    res.status(resp.status);
    resp.headers.forEach((v, n) => {
      if (!['transfer-encoding','content-encoding','content-length'].includes(n.toLowerCase())) {
        res.setHeader(n, v);
      }
    });

    const buf = Buffer.from(await resp.arrayBuffer());
    res.send(buf);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Proxy failed', details: String(err) });
  }
}
