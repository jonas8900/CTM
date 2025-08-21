let tokenCache = { access_token: null, expires_at: 0 };

async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.access_token && now < tokenCache.expires_at - 60_000) {
    return tokenCache.access_token;
  }

  const basic = Buffer
    .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
    .toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token error ${res.status}: ${t}`);
  }

  const data = await res.json();
  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.access_token;
}

export default async function handler(req, res) {
  try {
    const q = (req.query.q || '').toString().trim();
    const limit = Number(req.query.limit || 8);
    const market = (req.query.market || 'DE').toString();

    if (!q) return res.status(200).json({ items: [] });

    const token = await getAccessToken();
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('q', q);
    url.searchParams.set('type', 'track');
    url.searchParams.set('limit', Math.min(limit, 10));
    url.searchParams.set('market', market);

    const r = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (r.status === 429) {
      return res.status(429).json({ items: [], message: 'Rate limit' });
    }

    if (!r.ok) {
      const t = await r.text();
      return res.status(r.status).json({ error: t });
    }

    const data = await r.json();
    const items = (data.tracks?.items || []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      image: t.album?.images?.[t.album.images.length - 1]?.url || null, 
      uri: t.uri,
    }));

    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
