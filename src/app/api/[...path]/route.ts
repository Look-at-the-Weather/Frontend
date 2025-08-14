import { BASEURL } from '@/config/constants';
import { NextRequest, NextResponse } from 'next/server';

async function proxyRequest(req: NextRequest) {
  try {
    const { method } = req;
    const { pathname, search } = req.nextUrl;
    const apiUrl = `${BASEURL}${pathname.replace('/api', '')}${search}`;

    const contentType = req.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const isFile = contentType.includes('multipart/form-data');

    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('content-length');

    let body: any = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      if (isFile) {
        body = await req.formData();
        headers.delete('content-type');
      } else if (isJson) {
        const json = await req.json();
        body = JSON.stringify(json);
        headers.set('content-type', 'application/json');
      }
    }

    // 백엔드로 요청
    const response = await fetch(apiUrl, {
      method,
      headers,
      credentials: 'include',
      body,
    });

    // 쿠키 전달 처리
    const proxyHeaders = new Headers(response.headers);
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      proxyHeaders.set('set-cookie', setCookie);
    }

    // 원본 body 그대로 복사
    const rawBody = await response.arrayBuffer();
    return new NextResponse(rawBody, {
      status: response.status,
      headers: proxyHeaders,
    });
  } catch (error) {
    console.error('프록시 처리 에러:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
