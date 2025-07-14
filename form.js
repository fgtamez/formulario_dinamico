let jsonRaw = null;
let respuestas = {};
let esquemaElegido = null;

// Cargar archivo JSON localmente
document.getElementById('schema-file').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file || !file.name.endsWith('.json')) {
    alert("Por favor selecciona un archivo .json válido.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      jsonRaw = JSON.parse(e.target.result);

      /*
            // Ajustar formato del JSON para acceso fácil
            const schems = Object.keys(jsonRaw).map(key => ({
              nombre: formatoNombre(key),
              idBloque: key,
              campos: jsonRaw[key]
            }));
      */
      llenarSelectorDeEsquemas(jsonRaw);
      document.getElementById('schema-selector').style.display = 'block';

    } catch (err) {
      alert("Error al leer el archivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
});

// Formatear nombre para mostrar en el menú
function formatoNombre(nombre) {
  return nombre
    .replace("inmueble_", "")
    .split("_")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// Llenar menú desplegable con los esquemas
function llenarSelectorDeEsquemas(datos) {
  const select = document.getElementById('schema-choice');
  select.innerHTML = '<option value="">-- Selecciona --</option>';
  console.log(datos);
  datos.forEach((bloque, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = bloque.nombre;
    select.appendChild(option);
  });

  // Agregar evento de selección
  select.onchange = () => {
    esquemaElegido = select.value;

    console.log("Esquema elegido:", esquemaElegido);


    if (esquemaElegido) {
      console.log("Datos del esquema:", datos[select.value]);
      mostrarFormularioCompleto(datos[select.value]); //[esquemaElegido]);
    }
  };
}

// Mostrar formulario completo
function mostrarFormularioCompleto(producto) {
  let campos = producto.campos;
  console.log("campos", campos);

  const container = document.getElementById('formulario-container');
  container.innerHTML = '';

  const form = document.createElement('form');
  form.classList.add('w3-container');

  const titulo = document.createElement('h3');
  titulo.textContent = `Datos del Inmueble`;
  form.appendChild(titulo);

  campos.forEach(campo => {
    const div = document.createElement('div');
    div.className = "w3-form-group";

    let input;



    switch (campo.tipo) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'range':
      case 'color':
      case 'number':
        input = document.createElement('input');
        input.type = campo.tipo;
        input.name = campo.id;
        input.placeholder = campo.texto;
        input.className = "w3-input w3-border";
        input.required = campo.requerido || false;
        if (campo.min !== undefined) input.min = campo.min;
        if (campo.max !== undefined) input.max = campo.max;
        if (campo.step !== undefined) input.step = campo.step;
        break;

      case 'checkbox':
        input = document.createElement('input');
        input.type = 'checkbox';
        input.name = campo.id;
        input.required = campo.requerido || false;

        const labelCheck = document.createElement('label');
        labelCheck.className = "w3-validate";
        labelCheck.textContent = campo.texto;
        labelCheck.prepend(input);
        div.appendChild(labelCheck);
        input = null;
        break;

      case 'select':
        input = document.createElement('select');
        input.name = campo.id;
        input.className = "w3-select w3-border";
        input.required = campo.requerido || false;

        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.textContent = "-- Selecciona --";
        defaultOpt.disabled = true;
        defaultOpt.selected = true;
        defaultOpt.hidden = true;
        input.appendChild(defaultOpt);

        campo.opciones.forEach(opcion => {
          const opt = document.createElement('option');
          opt.value = opcion;
          opt.textContent = opcion;
          input.appendChild(opt);
        });

        break;

      case 'textarea':
        input = document.createElement('textarea');
        input.name = campo.id;
        input.rows = campo.rows || 4;
        input.className = "w3-input w3-border";
        input.placeholder = campo.texto;
        input.required = campo.requerido || false;
        break;

      case 'currency':
        input = document.createElement('input');
        input.type = 'number';
        input.name = campo.id;
        input.placeholder = campo.texto;
        input.className = "w3-input w3-border";
        input.step = "0.01";
        input.required = campo.requerido || false;
        break;

      case 'decimal':
        input = document.createElement('input');
        input.type = 'number';
        input.name = campo.id;
        input.placeholder = campo.texto;
        input.className = "w3-input w3-border";
        input.step = "0.000001";
        input.required = campo.requerido || false;
        break;
case 'archivos':
    // Campo para IMÁGENES
    const inputImagenes = document.createElement('input');
    inputImagenes.type = 'file';
    inputImagenes.name = campo.id + '_imagenes';
    inputImagenes.className = "w3-input w3-border";
    inputImagenes.required = campo.requerido || false;
    inputImagenes.accept = "image/*";
    if (campo.maxFiles) inputImagenes.multiple = true;

    const previewContainerImagenes = document.createElement('div');
    previewContainerImagenes.id = `preview-${campo.id}-imagenes`;
    previewContainerImagenes.className = "preview-container w3-margin-top";

    inputImagenes.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        previewContainerImagenes.innerHTML = '';
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e2) {
                    const img = document.createElement('img');
                    img.src = e2.target.result;
                    img.className = "w3-image w3-border";
                    const span = document.createElement('span');
                    span.textContent = file.name;
                    previewContainerImagenes.appendChild(img);
                    previewContainerImagenes.appendChild(document.createTextNode(' '));
                    previewContainerImagenes.appendChild(span);
                    previewContainerImagenes.appendChild(document.createElement('br'));
                };
                reader.readAsDataURL(file);
            }
        });
    });

    const divImagenes = document.createElement('div');
    divImagenes.className = "w3-form-group";
    const labelImagenes = document.createElement('label');
    labelImagenes.className = "w3-text w3-small";
    labelImagenes.textContent = campo.texto + " (Imágenes)";
    divImagenes.appendChild(labelImagenes);
    divImagenes.appendChild(inputImagenes);
    divImagenes.appendChild(previewContainerImagenes);
    form.appendChild(divImagenes);


    // Campo para VIDEOS
    const inputVideos = document.createElement('input');
    inputVideos.type = 'file';
    inputVideos.name = campo.id + '_videos';
    inputVideos.className = "w3-input w3-border";
    inputVideos.required = campo.requerido || false;
    inputVideos.accept = "video/*";
    if (campo.maxFiles) inputVideos.multiple = true;

    const previewContainerVideos = document.createElement('div');
    previewContainerVideos.id = `preview-${campo.id}-videos`;
    previewContainerVideos.className = "preview-container w3-margin-top";

    inputVideos.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        previewContainerVideos.innerHTML = '';
        files.forEach(file => {
            if (file.type.startsWith('video/')) {
                const videoURL = URL.createObjectURL(file);
                const video = document.createElement('video');
                video.src = videoURL;
                video.controls = true;
                video.style.maxWidth = "100%";
                const span = document.createElement('span');
                span.textContent = file.name;
                previewContainerVideos.appendChild(video);
                previewContainerVideos.appendChild(document.createElement('br'));
                previewContainerVideos.appendChild(span);
            }
        });
    });

    const divVideos = document.createElement('div');
    divVideos.className = "w3-form-group";
    const labelVideos = document.createElement('label');
    labelVideos.className = "w3-text w3-small";
    labelVideos.textContent = campo.texto + " (Videos)";
    divVideos.appendChild(labelVideos);
    divVideos.appendChild(inputVideos);
    divVideos.appendChild(previewContainerVideos);
    form.appendChild(divVideos);


    // Campo para AUDIOS
    const inputAudios = document.createElement('input');
    inputAudios.type = 'file';
    inputAudios.name = campo.id + '_audios';
    inputAudios.className = "w3-input w3-border";
    inputAudios.required = campo.requerido || false;
    inputAudios.accept = "audio/*";
    if (campo.maxFiles) inputAudios.multiple = true;

    const previewContainerAudios = document.createElement('div');
    previewContainerAudios.id = `preview-${campo.id}-audios`;
    previewContainerAudios.className = "preview-container w3-margin-top";

    inputAudios.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        previewContainerAudios.innerHTML = '';
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const audioURL = URL.createObjectURL(file);
                const audio = document.createElement('audio');
                audio.src = audioURL;
                audio.controls = true;
                const span = document.createElement('span');
                span.textContent = file.name;
                previewContainerAudios.appendChild(audio);
                previewContainerAudios.appendChild(document.createElement('br'));
                previewContainerAudios.appendChild(span);
            }
        });
    });

    const divAudios = document.createElement('div');
    divAudios.className = "w3-form-group";
    const labelAudios = document.createElement('label');
    labelAudios.className = "w3-text w3-small";
    labelAudios.textContent = campo.texto + " (Audios)";
    divAudios.appendChild(labelAudios);
    divAudios.appendChild(inputAudios);
    divAudios.appendChild(previewContainerAudios);
    form.appendChild(divAudios);


    // Campo para DOCUMENTOS
    const inputDocumentos = document.createElement('input');
    inputDocumentos.type = 'file';
    inputDocumentos.name = campo.id + '_documentos';
    inputDocumentos.className = "w3-input w3-border";
    inputDocumentos.required = campo.requerido || false;
    inputDocumentos.accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt";
    if (campo.maxFiles) inputDocumentos.multiple = true;

    const previewContainerDocumentos = document.createElement('div');
    previewContainerDocumentos.id = `preview-${campo.id}-documentos`;
    previewContainerDocumentos.className = "preview-container w3-margin-top";

    inputDocumentos.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        previewContainerDocumentos.innerHTML = '';
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = function () {
                    const typedArray = new Uint8Array(reader.result);
                    pdfjsLib.getDocument({ data: typedArray }).promise.then(pdf => {
                        pdf.getPage(1).then(page => {
                            const viewport = page.getViewport({ scale: 0.5 });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d'); // ✅ Aquí estaba 'd2'
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const renderContext = { canvasContext: context, viewport: viewport };
                            page.render(renderContext).promise.then(() => {
                                const span = document.createElement('span');
                                span.textContent = file.name;
                                previewContainerDocumentos.appendChild(span);
                                previewContainerDocumentos.appendChild(document.createElement('br'));
                                previewContainerDocumentos.appendChild(canvas);
                            });
                        });
                    });
                };
                reader.readAsArrayBuffer(file);
            } else {
                const p = document.createElement('p');
                p.textContent = `${file.name} (${file.type || 'Documento'})`;
                previewContainerDocumentos.appendChild(p);
            }
        });
    });

    const divDocumentos = document.createElement('div');
    divDocumentos.className = "w3-form-group";
    const labelDocumentos = document.createElement('label');
    labelDocumentos.className = "w3-text w3-small";
    labelDocumentos.textContent = campo.texto + " (Documentos)";
    divDocumentos.appendChild(labelDocumentos);
    divDocumentos.appendChild(inputDocumentos);
    divDocumentos.appendChild(previewContainerDocumentos);
    form.appendChild(divDocumentos);

    break;
    
      default:
        input = document.createElement('input');
        input.type = 'text';
        input.name = campo.id;
        input.placeholder = campo.texto;
        input.className = "w3-input w3-border";
        input.required = campo.requerido || false;
    }

    if (input && input.type !== 'checkbox') {
      const label = document.createElement('label');
      label.className = "w3-text w3-small";
      label.textContent = campo.texto;
      div.appendChild(label);
      div.appendChild(input);
    }

    form.appendChild(div);
  });

  // Botón de envío
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Guardar Datos';
  submitBtn.className = "w3-button w3-blue w3-margin-top";
  form.appendChild(submitBtn);

  // Manejo del envío
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const datos = {};

    formData.forEach((value, key) => {
      datos[key] = value;
    });

    // Guardamos todas las respuestas
    respuestas[esquemaElegido] = datos;

    // Mostrar resultados
    const historial = document.getElementById('historial-container');
    historial.innerHTML = `
      <pre class="w3-light-grey w3-padding">${JSON.stringify(respuestas, null, 2)}</pre>
    `;
  });

  container.appendChild(form);
}