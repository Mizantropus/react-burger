export default async function checkResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Unknown error');
  return data;
}
