const GAS_URL = 'https://script.google.com/macros/s/AKfycbzfDUplLpLK6JkUS6gCMq9Txgx-inInUcQlIvUFchqzryJ0DqvykprGEhpZOME9Ows/exec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ status: 'error', message: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.text();
    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    });

    const text = await gasRes.text();
    return new Response(text || JSON.stringify({ status: 'error', message: 'GAS returned an empty response' }), {
      status: gasRes.status,
      headers: {
        ...corsHeaders,
        'Content-Type': gasRes.headers.get('Content-Type') || 'application/json;charset=utf-8',
      },
    });
  } catch (error) {
    return json({ status: 'error', message: error.message || 'Proxy failed' }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
}
