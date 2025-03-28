export async function GET(request: Request) {
  return new Response('Preview mode enabled', {
    status: 200,
    headers: {
      'Set-Cookie': 'preview=true; Path=/'
    }
  })
} 