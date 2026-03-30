export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Webhook WayMB — aceita POST em /webhook.php
    if (url.pathname === '/webhook.php' && request.method === 'POST') {
      try {
        const body = await request.json();
        console.log('WayMB webhook recebido:', JSON.stringify(body));
      } catch (_) {}

      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tudo o resto → ficheiros estáticos normais
    return env.ASSETS.fetch(request);
  }
};
