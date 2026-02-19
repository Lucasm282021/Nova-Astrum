# NOVA ASTRUM 🚀

**Nova Astrum** es un emocionante juego de disparos espacial (Space Shooter) estilo arcade desarrollado con HTML5 Canvas, CSS3 y JavaScript puro (Vanilla JS). Defiende la galaxia contra oleadas infinitas de enemigos, esquiva proyectiles y alcanza la puntuación más alta.

## 🎮 Características

*   **Jugabilidad Arcade:** Acción rápida y fluida con dificultad progresiva.
*   **Selección de Naves:** Elige entre dos modelos de naves (Modelo 1 Azul y Modelo 2 Rojo) antes de comenzar.
*   **Variedad de Enemigos:**
    *   👾 Enemigos Normales.
    *   🔫 Naves que disparan (Shooters).
    *   💨 Naves rápidas (Kamikazes).
    *   🛡️ Tanques (Requieren múltiples disparos).
*   **Power-Ups (Mejoras):**
    *   🛡️ **Escudo:** Otorga invulnerabilidad temporal (5s).
    *   ⚡ **Arma:** Mejora el disparo a doble cañón (10s).
*   **Niveles de Dificultad:** Ajustable entre Fácil, Normal y Difícil (afecta la velocidad y frecuencia de aparición).
*   **Sistema de Puntuación:**
    *   Guardado local de mejores puntuaciones (High Scores) usando `localStorage`.
    *   Tabla de líderes (Top 10).
*   **Soporte Multiplataforma:**
    *   📱 **Diseño Responsivo:** Interfaz adaptable a diferentes resoluciones y dispositivos móviles.
    *   �️ **PC:** Control con Mouse.
    *   📱 **Móvil:** Control Táctil (Touch).
*   **Audio:** Efectos de sonido inmersivos y música de fondo (con opciones de Mute).

## 🕹️ Controles

### PC (Escritorio)
*   **Movimiento:** Mueve el **Mouse** para dirigir la nave.
*   **Disparo:** Haz **Clic Izquierdo** para disparar.
*   **Pausa:** Presiona la tecla `P` o `Esc`.

### Móvil / Tablet
*   **Movimiento:** Toca y arrastra el dedo por la pantalla.
*   **Disparo:** Toca la pantalla (o mantén presionado mientras te mueves).

## ⚡ Power-Ups

Durante la partida aparecerán ítems especiales flotando:
*   **Escudo (Icono Plateado):** Crea un campo de fuerza que te protege de todo daño. ¡Aprovecha para destruir enemigos chocando contra ellos!
*   **Rayo (Icono Dorado):** Duplica tu potencia de fuego. Ideal para limpiar oleadas grandes de enemigos.

## 🛠️ Instalación y Ejecución

Este proyecto es una aplicación web estática, por lo que no requiere instalación de dependencias complejas.

1.  **Clonar o Descargar:**
    Descarga la carpeta del proyecto en tu computadora.

2.  **Estructura de Archivos:**
    Asegúrate de tener la siguiente estructura:
    ```text
    Nova-Astrum/
    ├── img/              # Imágenes (player, enemigos, fondos, explosiones)
    ├── sound/            # Efectos de sonido y música
    ├── index.html        # Estructura principal
    ├── style.css         # Estilos visuales
    ├── script.js         # Lógica del juego
    └── README.md         # Documentación
    ```

3.  **Ejecutar:**
    *   Simplemente abre el archivo `index.html` en tu navegador web favorito (Chrome, Firefox, Edge, etc.).
    *   *Nota:* Para una mejor experiencia con la carga de audios e imágenes, se recomienda usar un servidor local (como Live Server en VS Code), aunque funciona directamente desde el archivo.

## ⚙️ Tecnologías Utilizadas

*   **HTML5:** Estructura semántica y elemento `<canvas>` para el renderizado gráfico.
*   **CSS3:** Estilos modernos, animaciones, Flexbox y diseño responsivo.
*   **JavaScript (ES6+):** Lógica del juego, bucle de renderizado, detección de colisiones y manejo del DOM.

## 📝 Créditos

Desarrollado como parte del portafolio de proyectos 2026.

*   **Lógica y Código:** [Montero Lucas Damian / Desarrollador]
*   **Assets:** Imágenes y sonidos integrados en la carpeta de recursos.

---

## 🐛 Estado del Proyecto

Actualmente el juego es funcional y estable.

**Mejoras Futuras Planeadas:**
*   [x] Agregar Power-ups (Escudos, Disparo Doble).
*   [x] Optimización de interfaz y refactorización de código (CSS/HTML).
*   [ ] Implementar Jefes Finales cada 10 niveles.
*   [ ] Efectos de partículas más avanzados.

---

*¡Disfruta de Nova Astrum y alcanza las estrellas!* 🌟