const port = 8080;

// deno-lint-ignore no-unused-vars
const handler = (request: Request): Response => {
  const endpoint = 'http://localhost:3000/api/oauth2/authorize';
  const params = [
    'response_type=code',
    'client_id=9aeb7ebf-09e9-4e96-88a7-b3cf9f9739a2',
    'redirect_uri=http://localhost:8080/callback',
    'scope=contacts.read contacts.write',
    'state=abcdefghijklmnopqrstuvwxyz123456789',
    'code_challenge=92d3b56942866d1edf02c33339b7c3dc37c6201282bb238cb47f0d3289f28a93f1bdd8af6ca9913aed0c4c',
    'code_challenge_method=S256',
  ].map((param) => param.split('=')).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  const body = `Please log in to the <a href="${endpoint}?${params}">SRAM Authorization Server</a> and pick a folder to mount from somewhere.`;
    
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    }
  });
};

Deno.serve({ port }, handler);
