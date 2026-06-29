const GAS_URL = 'https://script.google.com/macros/s/AKfycbzfDUplLpLK6JkUS6gCMq9Txgx-inInUcQlIvUFchqzryJ0DqvykprGEhpZOME9Ows/exec';

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Method not allowed'
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
  }

  try {
    const body = await request.text();

    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    const text = await gasRes.text();

    return new Response(text || JSON.stringify({ status: 'ok' }), {
      status: gasRes.status,
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message || 'Proxy failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
  }
}
