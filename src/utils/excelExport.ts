/**
 * Utilidad Oficial de Exportación e Impresión en Formato Excel (SICE-CBA)
 * Genera documentos compatibles al 100% con Microsoft Excel (.xls / XML Spreadsheet)
 * con membrete institucional, cuadrícula visible, anchos de columna y configuración
 * de página para impresión directa (Área de Impresión, Orientación, Ajuste a 1 página).
 */

export interface ExcelColumn {
  header: string;
  key?: string;
  width?: number; // ancho aproximado en caracteres o px
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number';
}

export interface ExcelSignature {
  title: string;
  subtitle?: string;
}

export interface ExcelReportOptions {
  title: string;
  subtitle?: string;
  schoolYear?: string;
  lapso?: number | string;
  grade?: string;
  section?: string;
  level?: string;
  teacherName?: string;
  orientation?: 'landscape' | 'portrait';
  columns: ExcelColumn[];
  data: (string | number)[][];
  signatures?: ExcelSignature[];
  extraNotes?: string[];
  filename?: string;
  sheetName?: string;
}

function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Genera y descarga un libro de Excel (.xls) estructurado con membrete, tabla y pie de firmas
 */
export function exportReportToExcel(options: ExcelReportOptions): void {
  const {
    title,
    subtitle = 'REGISTRO INSTITUCIONAL OFICIAL CBA',
    schoolYear = '2025 - 2026',
    lapso,
    grade,
    section,
    level,
    teacherName,
    orientation = 'landscape',
    columns,
    data,
    signatures,
    extraNotes,
    filename = 'Reporte_Oficial_CBA',
    sheetName = 'Reporte Oficial'
  } = options;

  const totalCols = Math.max(columns.length, 6);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const metadataItems: string[] = [];
  if (schoolYear) metadataItems.push(`<b>AÑO ESCOLAR:</b> ${escapeHtml(schoolYear)}`);
  if (lapso) metadataItems.push(`<b>MOMENTO / LAPSO:</b> ${escapeHtml(lapso)}`);
  if (grade) metadataItems.push(`<b>CURSO/SALA:</b> ${escapeHtml(grade)}`);
  if (section) metadataItems.push(`<b>SECCIÓN:</b> "${escapeHtml(section)}"`);
  if (level) metadataItems.push(`<b>NIVEL:</b> ${escapeHtml(level)}`);
  if (teacherName) metadataItems.push(`<b>DOCENTE:</b> ${escapeHtml(teacherName)}`);
  metadataItems.push(`<b>FECHA DE EMISIÓN:</b> ${dateFormatted}`);

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
  <title>${escapeHtml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${escapeHtml(sheetName.slice(0, 31))}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
            <x:Print>
              <x:Orientation>${orientation === 'landscape' ? 'Landscape' : 'Portrait'}</x:Orientation>
              <x:FitWidth>1</x:FitWidth>
              <x:FitHeight>0</x:FitHeight>
              <x:ValidPrinterInfo/>
            </x:Print>
            <x:PageSetup>
              <x:Layout x:Orientation="${orientation === 'landscape' ? 'Landscape' : 'Portrait'}"/>
              <x:Header x:Margin="0.3"/>
              <x:Footer x:Margin="0.3"/>
              <x:PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>
            </x:PageSetup>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 10pt;
      color: #000000;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    .inst-header {
      text-align: center;
      font-size: 9pt;
      font-weight: bold;
      color: #475569;
      text-transform: uppercase;
    }
    .inst-title {
      text-align: center;
      font-size: 14pt;
      font-weight: 900;
      color: #1B1C33;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .inst-subtitle {
      text-align: center;
      font-size: 11pt;
      font-weight: bold;
      color: #2C2E53;
      text-transform: uppercase;
    }
    .metadata-bar {
      background-color: #F1F5F9;
      border: 1px solid #CBD5E1;
      font-size: 9pt;
      padding: 6px;
      text-align: center;
    }
    th.col-header {
      background-color: #2C2E53;
      color: #FFFFFF;
      font-weight: bold;
      font-size: 9.5pt;
      border: 1px solid #000000;
      padding: 6px 4px;
      text-align: center;
      vertical-align: middle;
      mso-number-format: "\\@";
    }
    td.cell-data {
      border: 1px solid #000000;
      padding: 4px 6px;
      font-size: 9.5pt;
      vertical-align: middle;
    }
    td.align-left {
      text-align: left;
      mso-number-format: "\\@";
    }
    td.align-center {
      text-align: center;
      mso-number-format: "\\@";
    }
    td.align-right {
      text-align: right;
    }
    td.text-bold {
      font-weight: bold;
    }
    .note-text {
      font-size: 8.5pt;
      color: #334155;
      font-style: italic;
    }
    .signature-title {
      border-top: 1px solid #000000;
      text-align: center;
      font-size: 9pt;
      font-weight: bold;
      padding-top: 4px;
    }
    .signature-sub {
      text-align: center;
      font-size: 8pt;
      color: #64748B;
    }
  </style>
</head>
<body>
  <table>
    <!-- Membrete Oficial -->
    <tr>
      <td colspan="${totalCols}" class="inst-header">
        REPÚBLICA BOLIVARIANA DE VENEZUELA • MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
      </td>
    </tr>
    <tr>
      <td colspan="${totalCols}" class="inst-title">
        U.E.P. COLEGIO BELLAS ARTES • MARACAIBO, ESTADO ZULIA
      </td>
    </tr>
    <tr>
      <td colspan="${totalCols}" class="inst-subtitle">
        ${escapeHtml(title)}
      </td>
    </tr>
    ${subtitle ? `
    <tr>
      <td colspan="${totalCols}" style="text-align: center; font-size: 9pt; color: #475569; font-weight: bold;">
        ${escapeHtml(subtitle)}
      </td>
    </tr>
    ` : ''}
    <tr><td colspan="${totalCols}" style="height: 6px;"></td></tr>

    <!-- Barra de Metadatos -->
    <tr>
      <td colspan="${totalCols}" class="metadata-bar">
        ${metadataItems.join(' &nbsp;&nbsp;|&nbsp;&nbsp; ')}
      </td>
    </tr>
    <tr><td colspan="${totalCols}" style="height: 8px;"></td></tr>

    <!-- Encabezados de Columnas -->
    <thead>
      <tr>
        ${columns.map(col => `
          <th class="col-header" style="${col.width ? `width: ${col.width}px; min-width: ${col.width}px;` : ''}">
            ${escapeHtml(col.header)}
          </th>
        `).join('')}
      </tr>
    </thead>

    <!-- Filas de Datos -->
    <tbody>
      ${data.length === 0 ? `
        <tr>
          <td colspan="${totalCols}" class="cell-data align-center" style="padding: 18px; color: #64748B;">
            No existen registros cargados para los criterios seleccionados.
          </td>
        </tr>
      ` : data.map((row, rowIdx) => {
        const bgStyle = rowIdx % 2 === 1 ? 'background-color: #F8FAFC;' : 'background-color: #FFFFFF;';
        return `
          <tr style="${bgStyle}">
            ${row.map((cell, colIdx) => {
              const colDef = columns[colIdx] || { align: 'left', format: 'text' };
              const alignClass = colDef.align === 'center' ? 'align-center' : colDef.align === 'right' ? 'align-right' : 'align-left';
              const isFirstOrSecond = colIdx === 0 || colIdx === 1;
              return `
                <td class="cell-data ${alignClass} ${isFirstOrSecond ? 'text-bold' : ''}">
                  ${escapeHtml(cell)}
                </td>
              `;
            }).join('')}
          </tr>
        `;
      }).join('')}
    </tbody>

    <!-- Notas al pie opcionales -->
    ${extraNotes && extraNotes.length > 0 ? `
      <tr><td colspan="${totalCols}" style="height: 10px;"></td></tr>
      ${extraNotes.map(note => `
        <tr>
          <td colspan="${totalCols}" class="note-text">
            • ${escapeHtml(note)}
          </td>
        </tr>
      `).join('')}
    ` : ''}

    <!-- Firmas Oficiales Institucionales -->
    ${signatures && signatures.length > 0 ? `
      <tr><td colspan="${totalCols}" style="height: 35px;"></td></tr>
      <tr>
        ${(() => {
          const sigCols = signatures.length;
          const spanPerSig = Math.floor(totalCols / sigCols);
          const remainder = totalCols % sigCols;
          return signatures.map((sig, idx) => {
            const currentSpan = idx === sigCols - 1 ? spanPerSig + remainder : spanPerSig;
            return `
              <td colspan="${currentSpan}" style="padding: 0 15px; vertical-align: top;">
                <div class="signature-title">${escapeHtml(sig.title)}</div>
                ${sig.subtitle ? `<div class="signature-sub">${escapeHtml(sig.subtitle)}</div>` : ''}
              </td>
            `;
          }).join('');
        })()}
      </tr>
    ` : ''}
  </table>
</body>
</html>
  `.trim();

  downloadExcelBlob(html, filename);
}

/**
 * Convierte un elemento HTML (como una tabla) en un archivo Excel imprimible
 */
export function exportTableElementToExcel(
  element: HTMLElement,
  options: {
    title: string;
    filename?: string;
    orientation?: 'landscape' | 'portrait';
    sheetName?: string;
  }
): void {
  const {
    title,
    filename = 'Reporte_CBA',
    orientation = 'landscape',
    sheetName = 'Hoja 1'
  } = options;

  // Clona el elemento y remueve elementos con clase 'no-print'
  const clone = element.cloneNode(true) as HTMLElement;
  const noPrints = clone.querySelectorAll('.no-print, button, input[type="button"]');
  noPrints.forEach(el => el.remove());

  const tableHtml = clone.innerHTML;

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
  <title>${escapeHtml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${escapeHtml(sheetName.slice(0, 31))}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
            <x:Print>
              <x:Orientation>${orientation === 'landscape' ? 'Landscape' : 'Portrait'}</x:Orientation>
              <x:FitWidth>1</x:FitWidth>
              <x:FitHeight>0</x:FitHeight>
              <x:ValidPrinterInfo/>
            </x:Print>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 10pt; color: #000; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #000; padding: 4px 6px; }
    th { background-color: #2C2E53; color: #fff; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  ${tableHtml}
</body>
</html>
  `.trim();

  downloadExcelBlob(html, filename);
}

/**
 * Descarga el contenido en formato Blob compatible con Excel (.xls)
 */
function downloadExcelBlob(content: string, filename: string): void {
  const safeFilename = filename.toLowerCase().endsWith('.xls') ? filename : `${filename}.xls`;
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
