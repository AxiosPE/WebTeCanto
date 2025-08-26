// Función para cargar el footer
async function loadFooter() {
  try {
    const response = await fetch('./components/footer.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const footerHTML = await response.text();
    
    // Crear un contenedor para el footer si no existe
    let footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
      footerContainer = document.createElement('div');
      footerContainer.id = 'footer-container';
      document.body.appendChild(footerContainer);
    }
    
    // Insertar el HTML del footer
    footerContainer.innerHTML = footerHTML;
    
    console.log('Footer cargado exitosamente');
  } catch (error) {
    console.error('Error al cargar el footer:', error);
    
    // Fallback: crear un footer básico si falla la carga
    createFallbackFooter();
  }
}

// Footer de respaldo en caso de error
function createFallbackFooter() {
  const footerContainer = document.getElementById('footer-container') || document.createElement('div');
  footerContainer.id = 'footer-container';
  
  footerContainer.innerHTML = `
    <footer class="bg-black text-white py-8 text-center">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex items-center justify-center gap-2 mb-4">
          <img src="./assets/Logo-transparente.png" alt="Logo de Te Canto" 
               style="width: 16px !important; height: 16px !important; max-width: 16px !important; max-height: 16px !important; object-fit: contain;">
          <div class="text-sm font-bold" style="color: var(--color-amarillo);">TeCanto Music</div>
        </div>
        <p class="text-gray-300 text-sm mb-4">Música en vivo para tus momentos especiales</p>
        <p class="text-gray-400 text-xs">© ${new Date().getFullYear()} TeCanto Music. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
  
  if (!document.getElementById('footer-container')) {
    document.body.appendChild(footerContainer);
  }
}

// Cargar el footer cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
