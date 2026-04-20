import { getProjects } from './src/lib/projects.ts';

async function testFetch() {
  console.log('--- Probando getProjects ---');
  try {
    const projects = await getProjects();
    console.log(`✅ Éxito: Se cargaron ${projects.length} proyectos.`);
    console.log('Primer proyecto:', projects[0]?.title);
  } catch (err) {
    console.error('❌ Fallo crítico:', err);
  }
}

testFetch();
