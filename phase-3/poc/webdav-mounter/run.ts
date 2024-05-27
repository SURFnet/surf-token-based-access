const port = 8080;

// deno-lint-ignore no-unused-vars
const handler = (request: Request): Response => {
  const body = `Please log in to the <a href="http://localhost:8090">SRAM Authorization Server</a> and pick a folder to mount from somewhere.`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    }
  });
};

console.log("Please open https://localhost:8080/ in your browser to mount a WebDAV folder from SRAM.");
Deno.serve({ port }, handler);
