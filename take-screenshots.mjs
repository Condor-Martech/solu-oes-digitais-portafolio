import fs from 'fs';
import { chromium } from 'playwright';

const jsonPath = './data/projects.json';
const projects = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

(async () => {
  console.log('Lanzando el navegador Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ 
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina (Alta qualidade)
  });

  // Asegurar que la carpeta public/screenshots existe
  if (!fs.existsSync('./public/screenshots')) {
    fs.mkdirSync('./public/screenshots', { recursive: true });
  }

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (project.link) {
      console.log(`[${i+1}/${projects.length}] Capturando: ${project.title} (${project.link})`);
      try {
        // Redirige a la página y espera a que el tráfico de red se calme
        await page.goto(project.link, { waitUntil: 'load', timeout: 30000 });
        
        // Simular un poco de scroll para activar imágenes lazy loading
        await page.evaluate(() => window.scrollTo(0, 600));
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, 0));
        
        // Espera extra para animaciones / popups
        await page.waitForTimeout(2000);
        
        const path = `./public/screenshots/${project.id}.png`;
        // Capturar solo la vista inicial (Above the fold) para un look consistente
        await page.screenshot({ path, fullPage: false });
        console.log(`✅ Guardado: ${path}`);
        
        // Actualizar el valor en el objeto
        projects[i].image = `/screenshots/${project.id}.png`;
      } catch (err) {
        console.error(`❌ Falló la captura de ${project.title}: ${err.message}`);
      }
    }
  }

  await browser.close();

  // Escribir el nuevo JSON actualizado
  fs.writeFileSync(jsonPath, JSON.stringify(projects, null, 2));
  console.log('🚀 Actualización del archivo projects.json finalizada.');
})();
