async function checkUrl() {
  const url = 'https://s3.cndr.me/lp-content/projects.json';
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const text = await res.text();
      console.log('Content preview:', text.substring(0, 100));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}
checkUrl();
