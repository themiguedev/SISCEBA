/**
 * Módulo de Integración con Google Classroom para SICE-CBA
 * 
 * Permite a los docentes compartir planificaciones didácticas oficiales,
 * formatear tareas y evaluaciones alineadas al subsistema educativo (Inicial, Primaria, Media General),
 * y pre-cargar automáticamente la información con emojis y saltos de párrafo en el campo Instrucciones de Google Classroom.
 */

import { PlanQuincenal } from '../types';

export interface ClassroomCourseWorkMaterial {
  link?: {
    url: string;
    title: string;
  };
}

export interface ClassroomCourseWorkPayload {
  title: string;
  description: string;
  materials: ClassroomCourseWorkMaterial[];
  state: 'DRAFT' | 'PUBLISHED';
  workType: 'ASSIGNMENT' | 'MATERIAL';
  maxPoints?: number;
  scheduledTime?: string;
  topicId?: string;
}

/**
 * Genera el cuerpo de texto estructurado para el parámetro `&body=` de la URL de Google Classroom.
 * Nota técnica: Google Frontend (GFE) sanitiza %0A y %0D reemplazándolos por espacios.
 * Para garantizar saltos de línea forzados e independientes que sobrevivan a la URL de Classroom,
 * empleamos los separadores de línea Unicode U+2028 (\u2028) que el renderizador de texto
 * de Google Classroom interpreta como saltos de línea genuinos.
 */
export const generateClassroomBodyParam = (
  plan: PlanQuincenal,
  areaName: string,
  shareableUrl: string
): string => {
  const isPrimaria = plan.level === 'PRIMARIA';
  const isMedia = plan.level === 'MEDIA_GENERAL';

  const nivelLabel = isPrimaria
    ? 'Educación Primaria'
    : isMedia
    ? 'Educación Media General'
    : 'Educación Inicial';

  const ejeLabel = isPrimaria ? 'Componente' : 'Tema Generador';
  const ejeValor = isPrimaria
    ? (plan.componente || plan.projectTheme || 'Proyecto de Aprendizaje')
    : (plan.temaGenerador || plan.projectTheme || 'Área de Formación');

  // Separador de línea Unicode U+2028 (no es interceptado ni aplanado como espacio por el proxy)
  const L = '\u2028';
  const P = '\u2028\u2028';
  const DIVIDER = '────────────────────────'; // Ancho seguro para evitar quiebres feos en el recuadro

  const blocks: string[] = [];

  // 1. Encabezado institucional
  blocks.push(`🏛️ U.C.E. COLEGIO BELLAS ARTES${L}📋 PLANIFICACIÓN DIDÁCTICA OFICIAL`);
  blocks.push(DIVIDER);

  // 2. Datos académicos generales (cada uno en su propia línea)
  const datosLines = [
    '📌 DATOS ACADÉMICOS GENERALES:',
    `• 📚 Asignatura: ${areaName}`,
    `• 🏫 Nivel: ${nivelLabel}`,
    `• 👥 Grado y Sección: ${plan.gradeSection}`,
    plan.docenteName ? `• 👨‍🏫 Docente: ${plan.docenteName}` : '',
    `• 🗓️ Período: ${plan.lapso}° Lapso | ${plan.periodoQuincenal || `${plan.startDate} al ${plan.endDate}`}`,
    `• 🎯 ${ejeLabel}: ${ejeValor}`
  ].filter(Boolean);
  blocks.push(datosLines.join(L));

  blocks.push(DIVIDER);

  // 3. Secuencia Didáctica (Inicio / Desarrollo / Cierre)
  const hasSecuencia = plan.actividadesInicio || plan.actividadesDesarrollo || plan.actividadesCierre || plan.pedagogicalActivities;
  if (hasSecuencia) {
    const actLines: string[] = ['📝 SECUENCIA DE ACTIVIDADES PEDAGÓGICAS:'];
    
    if (plan.actividadesInicio) {
      actLines.push(`🔹 FASE DE INICIO:${L}${plan.actividadesInicio.trim()}`);
    }
    if (plan.actividadesDesarrollo) {
      actLines.push(`🔹 FASE DE DESARROLLO:${L}${plan.actividadesDesarrollo.trim()}`);
    }
    if (plan.actividadesCierre) {
      actLines.push(`🔹 FASE DE CIERRE:${L}${plan.actividadesCierre.trim()}`);
    }
    if (!plan.actividadesInicio && !plan.actividadesDesarrollo && !plan.actividadesCierre && plan.pedagogicalActivities) {
      actLines.push(plan.pedagogicalActivities.trim());
    }

    blocks.push(actLines.join(P));
    blocks.push(DIVIDER);
  }

  // 4. Matriz de Contenidos y Evaluación
  if (plan.rows && plan.rows.length > 0) {
    const evalBlocks: string[] = ['📊 MATRIZ DE EVALUACIÓN Y PONDERACIÓN:'];
    const numIcons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    plan.rows.forEach((row, idx) => {
      const num = numIcons[idx] || `[${idx + 1}]`;
      const itemParts: string[] = [
        `${num} Contenido: ${row.contenidoOReferente || 'Contenido Programático'}`,
        `   • 🎯 Aprendizaje Esperado: ${row.aprendizajesEsperados}`
      ];

      if (row.indicadoresCompetencia) {
        itemParts.push(`   • 📌 Indicadores: ${row.indicadoresCompetencia}`);
      }
      if (row.criteriosEvaluacion) {
        itemParts.push(`   • ⚖️ Criterios: ${row.criteriosEvaluacion}`);
      }
      if (row.tecnicasInstrumentos) {
        itemParts.push(`   • 🛠️ Instrumento: ${row.tecnicasInstrumentos}`);
      }
      if (row.ponderacionPercent) {
        if (isMedia) {
          const pts = Math.round((row.ponderacionPercent / 100) * 20);
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (${pts} / 20 pts vigesimal)`);
        } else if (isPrimaria) {
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (Formativa L - EP - I)`);
        } else {
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (Escala Literal A-E)`);
        }
      }

      evalBlocks.push(itemParts.join(L));
    });

    blocks.push(evalBlocks.join(P));
    blocks.push(DIVIDER);
  }

  // 5. Recursos didácticos
  if (plan.recursos || plan.fuentesConsulta) {
    const recLines: string[] = ['📦 RECURSOS Y FUENTES DIDÁCTICAS:'];
    if (plan.recursos) recLines.push(`• 📖 Materiales: ${plan.recursos}`);
    if (plan.fuentesConsulta) recLines.push(`• 🌐 Fuentes: ${plan.fuentesConsulta}`);
    blocks.push(recLines.join(L));
    blocks.push(DIVIDER);
  }

  // 6. Enlace institucional en SICE-CBA
  blocks.push(`🔗 CONSULTA INSTITUCIONAL EN SICE-CBA:${L}${shareableUrl}`);

  let fullBody = blocks.join(P);

  // Control defensivo de longitud de URL para navegadores (límite seguro 2800 caracteres)
  if (fullBody.length > 2800) {
    fullBody = fullBody.substring(0, 2750) + `${P}[... Ver detalle completo en: ${shareableUrl}]`;
  }

  return fullBody;
};

/**
 * Abre el diálogo oficial de compartir en Google Classroom en una ventana emergente centrada,
 * pre-llenando el Título, el Enlace y el campo de Instrucciones (body).
 */
export const openClassroomShareWindow = (
  shareUrl: string,
  title: string,
  bodyText?: string
): void => {
  if (typeof window === 'undefined') return;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = bodyText ? `&body=${encodeURIComponent(bodyText)}` : '';
  
  const targetUrl = `https://classroom.google.com/share?url=${encodedUrl}&title=${encodedTitle}${encodedBody}`;

  const width = 720;
  const height = 680;
  const left = window.screen.width ? (window.screen.width - width) / 2 : 100;
  const top = window.screen.height ? (window.screen.height - height) / 2 : 100;

  window.open(
    targetUrl,
    'GoogleClassroomShare',
    `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=yes`
  );
};

/**
 * Genera la descripción enriquecida en texto plano con espaciado generoso,
 * divisores visuales y emojis para copiar o previsualizar.
 */
export const generateClassroomTaskDescription = (
  plan: PlanQuincenal,
  areaName: string,
  shareableUrl: string
): string => {
  const isPrimaria = plan.level === 'PRIMARIA';
  const isMedia = plan.level === 'MEDIA_GENERAL';

  const nivelLabel = isPrimaria
    ? 'Educación Primaria'
    : isMedia
    ? 'Educación Media General'
    : 'Educación Inicial';

  const ejeLabel = isPrimaria ? 'Componente' : 'Tema Generador';
  const ejeValor = isPrimaria
    ? (plan.componente || plan.projectTheme || 'Proyecto de Aprendizaje')
    : (plan.temaGenerador || plan.projectTheme || 'Área de Formación');

  const DIVIDER = '────────────────────────';
  const blocks: string[] = [];

  blocks.push(`🏛️ U.C.E. COLEGIO BELLAS ARTES\n📋 PLANIFICACIÓN DIDÁCTICA OFICIAL`);
  blocks.push(DIVIDER);

  const datosLines = [
    '📌 DATOS ACADÉMICOS GENERALES:',
    `• 📚 Asignatura: ${areaName}`,
    `• 🏫 Nivel: ${nivelLabel}`,
    `• 👥 Grado y Sección: ${plan.gradeSection}`,
    plan.docenteName ? `• 👨‍🏫 Docente: ${plan.docenteName}` : '',
    `• 🗓️ Período: ${plan.lapso}° Lapso | ${plan.periodoQuincenal || `${plan.startDate} al ${plan.endDate}`}`,
    `• 🎯 ${ejeLabel}: ${ejeValor}`
  ].filter(Boolean);
  blocks.push(datosLines.join('\n'));

  blocks.push(DIVIDER);

  const hasSecuencia = plan.actividadesInicio || plan.actividadesDesarrollo || plan.actividadesCierre || plan.pedagogicalActivities;
  if (hasSecuencia) {
    const actLines: string[] = ['📝 SECUENCIA DE ACTIVIDADES PEDAGÓGICAS:'];
    
    if (plan.actividadesInicio) {
      actLines.push(`🔹 FASE DE INICIO:\n${plan.actividadesInicio.trim()}`);
    }
    if (plan.actividadesDesarrollo) {
      actLines.push(`🔹 FASE DE DESARROLLO:\n${plan.actividadesDesarrollo.trim()}`);
    }
    if (plan.actividadesCierre) {
      actLines.push(`🔹 FASE DE CIERRE:\n${plan.actividadesCierre.trim()}`);
    }
    if (!plan.actividadesInicio && !plan.actividadesDesarrollo && !plan.actividadesCierre && plan.pedagogicalActivities) {
      actLines.push(plan.pedagogicalActivities.trim());
    }

    blocks.push(actLines.join('\n\n'));
    blocks.push(DIVIDER);
  }

  if (plan.rows && plan.rows.length > 0) {
    const evalBlocks: string[] = ['📊 MATRIZ DE EVALUACIÓN Y PONDERACIÓN:'];
    const numIcons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    plan.rows.forEach((row, idx) => {
      const num = numIcons[idx] || `[${idx + 1}]`;
      const itemParts: string[] = [
        `${num} Contenido: ${row.contenidoOReferente || 'Contenido Programático'}`,
        `   • 🎯 Aprendizaje Esperado: ${row.aprendizajesEsperados}`
      ];

      if (row.indicadoresCompetencia) {
        itemParts.push(`   • 📌 Indicadores: ${row.indicadoresCompetencia}`);
      }
      if (row.criteriosEvaluacion) {
        itemParts.push(`   • ⚖️ Criterios: ${row.criteriosEvaluacion}`);
      }
      if (row.tecnicasInstrumentos) {
        itemParts.push(`   • 🛠️ Instrumento: ${row.tecnicasInstrumentos}`);
      }
      if (row.ponderacionPercent) {
        if (isMedia) {
          const pts = Math.round((row.ponderacionPercent / 100) * 20);
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (${pts} / 20 pts vigesimal)`);
        } else if (isPrimaria) {
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (Formativa L - EP - I)`);
        } else {
          itemParts.push(`   • 💯 Ponderación: ${row.ponderacionPercent}% (Escala Literal A-E)`);
        }
      }

      evalBlocks.push(itemParts.join('\n'));
    });

    blocks.push(evalBlocks.join('\n\n'));
    blocks.push(DIVIDER);
  }

  if (plan.recursos || plan.fuentesConsulta) {
    const recLines: string[] = ['📦 RECURSOS Y FUENTES DIDÁCTICAS:'];
    if (plan.recursos) recLines.push(`• 📖 Materiales: ${plan.recursos}`);
    if (plan.fuentesConsulta) recLines.push(`• 🌐 Fuentes: ${plan.fuentesConsulta}`);
    blocks.push(recLines.join('\n'));
    blocks.push(DIVIDER);
  }

  blocks.push(`🔗 CONSULTA INSTITUCIONAL EN SICE-CBA:\n${shareableUrl}`);

  return blocks.join('\n\n');
};

/**
 * Genera la versión HTML estructurada para Google Classroom (compatible con pegado enriquecido).
 */
export const generateClassroomTaskHtml = (
  plan: PlanQuincenal,
  areaName: string,
  shareableUrl: string
): string => {
  const isPrimaria = plan.level === 'PRIMARIA';
  const isMedia = plan.level === 'MEDIA_GENERAL';

  const nivelLabel = isPrimaria
    ? 'Educación Primaria'
    : isMedia
    ? 'Educación Media General'
    : 'Educación Inicial';

  const ejeLabel = isPrimaria ? 'Componente Institucional' : 'Tema Generador';
  const ejeValor = isPrimaria
    ? plan.componente || plan.projectTheme || 'Proyecto de Aprendizaje'
    : plan.temaGenerador || plan.projectTheme || 'Área de Formación';

  let html = `<p><strong>🏛️ U.C.E. COLEGIO BELLAS ARTES</strong><br><strong>📋 PLANIFICACIÓN DIDÁCTICA OFICIAL</strong></p>`;
  html += `<hr>`;
  html += `<p><strong>📌 DATOS ACADÉMICOS GENERALES:</strong></p>`;
  html += `<ul>`;
  html += `<li><strong>📚 Asignatura / Área:</strong> ${areaName}</li>`;
  html += `<li><strong>🏫 Nivel Educativo:</strong> ${nivelLabel}</li>`;
  html += `<li><strong>👥 Grado y Sección:</strong> ${plan.gradeSection}</li>`;
  html += `<li><strong>👨‍🏫 Docente Titular:</strong> ${plan.docenteName || 'Docente de la Asignatura'}</li>`;
  html += `<li><strong>🗓️ Lapso y Período:</strong> ${plan.lapso}° Lapso | ${plan.periodoQuincenal || `${plan.startDate} al ${plan.endDate}`}</li>`;
  html += `<li><strong>🎯 ${ejeLabel}:</strong> ${ejeValor}</li>`;
  html += `</ul>`;
  html += `<hr>`;

  if (plan.actividadesInicio || plan.actividadesDesarrollo || plan.actividadesCierre || plan.pedagogicalActivities) {
    html += `<p><strong>📝 SECUENCIA DE ACTIVIDADES PEDAGÓGICAS:</strong></p>`;
    if (plan.actividadesInicio) {
      html += `<p><strong>🔹 FASE DE INICIO:</strong><br>${plan.actividadesInicio.trim().replace(/\n/g, '<br>')}</p>`;
    }
    if (plan.actividadesDesarrollo) {
      html += `<p><strong>🔹 FASE DE DESARROLLO:</strong><br>${plan.actividadesDesarrollo.trim().replace(/\n/g, '<br>')}</p>`;
    }
    if (plan.actividadesCierre) {
      html += `<p><strong>🔹 FASE DE CIERRE:</strong><br>${plan.actividadesCierre.trim().replace(/\n/g, '<br>')}</p>`;
    }
    if (!plan.actividadesInicio && !plan.actividadesDesarrollo && !plan.actividadesCierre && plan.pedagogicalActivities) {
      html += `<p>${plan.pedagogicalActivities.trim().replace(/\n/g, '<br>')}</p>`;
    }
    html += `<hr>`;
  }

  if (plan.rows && plan.rows.length > 0) {
    html += `<p><strong>📊 MATRIZ DE CONTENIDOS Y CRITERIOS DE EVALUACIÓN:</strong></p>`;
    plan.rows.forEach((row, idx) => {
      html += `<p><strong>${idx + 1}️⃣ Contenido: ${row.contenidoOReferente || 'Contenido Programático'}</strong></p>`;
      html += `<ul>`;
      html += `<li><strong>🎯 Aprendizaje Esperado:</strong> ${row.aprendizajesEsperados}</li>`;
      if (row.indicadoresCompetencia) {
        html += `<li><strong>📌 Indicadores:</strong> ${row.indicadoresCompetencia}</li>`;
      }
      if (row.criteriosEvaluacion) {
        html += `<li><strong>⚖️ Criterios:</strong> ${row.criteriosEvaluacion}</li>`;
      }
      if (row.tecnicasInstrumentos) {
        html += `<li><strong>🛠️ Instrumento:</strong> ${row.tecnicasInstrumentos}</li>`;
      }
      if (row.ponderacionPercent) {
        if (isMedia) {
          const puntosVigesimal = Math.round((row.ponderacionPercent / 100) * 20);
          html += `<li><strong>💯 Ponderación:</strong> ${row.ponderacionPercent}% (Equivale a ${puntosVigesimal} / 20 pts en Escala Vigesimal)</li>`;
        } else if (isPrimaria) {
          html += `<li><strong>💯 Ponderación:</strong> ${row.ponderacionPercent}% (Evaluación Formativa / Cualitativa: L - EP - I)</li>`;
        } else {
          html += `<li><strong>💯 Ponderación:</strong> ${row.ponderacionPercent}% (Escala Literal: A, B, C, D, E)</li>`;
        }
      }
      html += `</ul>`;
    });
    html += `<hr>`;
  }

  if (plan.recursos || plan.fuentesConsulta) {
    html += `<p><strong>📦 RECURSOS Y FUENTES DIDÁCTICAS:</strong></p>`;
    html += `<ul>`;
    if (plan.recursos) {
      html += `<li><strong>📖 Materiales:</strong> ${plan.recursos}</li>`;
    }
    if (plan.fuentesConsulta) {
      html += `<li><strong>🌐 Fuentes:</strong> ${plan.fuentesConsulta}</li>`;
    }
    html += `</ul>`;
    html += `<hr>`;
  }

  html += `<p><strong>🔗 SICE-CBA:</strong> <a href="${shareableUrl}">${shareableUrl}</a></p>`;
  return html;
};

/**
 * Copia al portapapeles tanto el formato enriquecido (HTML) como texto plano con emojis y espaciado.
 */
export const copyClassroomTaskToClipboard = async (
  plan: PlanQuincenal,
  areaName: string,
  shareableUrl: string
): Promise<boolean> => {
  const plainText = generateClassroomTaskDescription(plan, areaName, shareableUrl);
  const htmlText = generateClassroomTaskHtml(plan, areaName, shareableUrl);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlText], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem no disponible, aplicando fallback a writeText:', err);
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.error('Error al copiar:', err);
  }

  return false;
};

/**
 * Genera el objeto estructurado CourseWork compatible con la API de Google Classroom v1.
 */
export const buildClassroomCourseWorkPayload = (
  plan: PlanQuincenal,
  areaName: string,
  shareableUrl: string
): ClassroomCourseWorkPayload => {
  const isMedia = plan.level === 'MEDIA_GENERAL';
  const maxPoints = isMedia ? 20 : undefined;
  const description = generateClassroomTaskDescription(plan, areaName, shareableUrl);

  return {
    title: `[${areaName}] ${plan.title || 'Planificación Didáctica'} - ${plan.gradeSection}`,
    description,
    materials: [
      {
        link: {
          url: shareableUrl,
          title: `Planificación Oficial SICE-CBA (${areaName} - ${plan.gradeSection})`
        }
      }
    ],
    state: 'DRAFT',
    workType: 'ASSIGNMENT',
    maxPoints
  };
};
