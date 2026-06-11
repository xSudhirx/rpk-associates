const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export async function submitWeb3Form(fields) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    throw new Error('missing_key');
  }

  const res = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      botcheck: '',
      ...fields,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error('submit_failed');
  }
  return data;
}
