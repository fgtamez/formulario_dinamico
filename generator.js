let campos = [];

function mostrarOpcionesAdicionales() {
    const tipo = document.getElementById('tipo').value;
    document.getElementById('opciones-seleccion').style.display = (tipo === 'select') ? 'block' : 'none';
    document.getElementById('limites-adicionales').style.display = ['imagenes', 'videos', 'audios', 'documentos'].includes(tipo) ? 'block' : 'none';
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('id').value = '';
    document.getElementById('opciones').value = '';
    document.getElementById('maxFiles').value = 5;
    document.getElementById('allowedTypes').value = '';
    document.getElementById('requerido').checked = false;
    mostrarOpcionesAdicionales();
}

function validarCampo(nombre, id) {
    if (!nombre || !id) {
        alert("Nombre e ID son obligatorios.");
        return false;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
        alert("El ID debe ser válido (solo letras, números y guiones bajos).");
        return false;
    }
    return true;
}

function agregarCampo() {
    const nombre = document.getElementById('nombre').value.trim();
    const id = document.getElementById('id').value.trim();
    const tipo = document.getElementById('tipo').value;
    const requerido = document.getElementById('requerido').checked;

    if (!validarCampo(nombre, id)) return;

    let campo = {
        id: id,
        texto: nombre,
        tipo: tipo,
        requerido: requerido
    };

    // Para selects
    if (tipo === 'select') {
        const opcionesTexto = document.getElementById('opciones').value;
        campo.opciones = opcionesTexto.split(',').map(o => o.trim()).filter(Boolean);
    }

    // Para archivos
    if (['imagenes', 'videos', 'audios', 'documentos'].includes(tipo)) {
        const maxFiles = parseInt(document.getElementById('maxFiles').value) || 5;
        campo.maxFiles = maxFiles;
        const allowedTypesInput = document.getElementById('allowedTypes').value;
        if (allowedTypesInput.trim()) {
            campo.allowedTypes = allowedTypesInput.split(',').map(t => t.trim());
        }
    }

    campos.push(campo);
    limpiarFormulario();
    actualizarVistaPrevia();
}

function actualizarVistaPrevia() {
    const preview = document.getElementById('formulario-preview');
    preview.innerHTML = '<h3>Vista previa del formulario:</h3>';

    campos.forEach((campo, index) => {
        const contenedor = document.createElement('div');
        contenedor.className = 'w3-card campo-preview';

        const p = document.createElement('p');
        p.innerHTML = `<strong>${index + 1}. ${campo.texto}</strong><br>
                      Tipo: ${campo.tipo}<br>
                      ID: ${campo.id}<br>
                      Requerido: ${campo.requerido ? 'Sí' : 'No'}<br>
                      Opciones: ${campo.opciones ? campo.opciones.join(', ') : 'N/A'}<br>
                      Tipos permitidos: ${campo.allowedTypes ? campo.allowedTypes.join(', ') : 'N/A'}<br>
                      Máximo de archivos: ${campo.maxFiles || 'N/A'}`;

        contenedor.appendChild(p);
        preview.appendChild(contenedor);
    });
}

function exportarEsquema() {
    const nombre = prompt("Nombre del esquema:", "Inmueble") || "Sin nombre";
    const esquema = {
        nombre: nombre,
        campos: campos
    };

    const jsonStr = JSON.stringify(esquema, null, 2);

    // Mostrar en pantalla
    const pre = document.getElementById('esquema-json');
    pre.textContent = jsonStr;

    // Descargar como archivo
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre.replace(/\s+/g, '_')}_schema.json`;
    a.textContent = 'Descargando...';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}