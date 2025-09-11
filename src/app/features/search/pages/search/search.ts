import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';
@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  terminoBusqueda = '';
  resultado = '';
  resultados: any[] = [];
  groupedResultados: { [descripcion: string]: any[] } = {}; // <-- nuevo
  cargando = false;
tipoDocumento = '1'; // por defecto DNI

  collapsedGroups: { [key: string]: boolean } = {};
  objectKeys = Object.keys;

  constructor(private coverageService: SearchService) { }



  toggleCollapse(key: string) {
    if (this.collapsedGroups[key] === undefined) {
      this.collapsedGroups[key] = false; // Mostrar en el primer clic
    } else {
      this.collapsedGroups[key] = !this.collapsedGroups[key];
    }
  }

  isCollapsed(key: string): boolean {
    return this.collapsedGroups[key] ?? true;
  }
  descargarResultadosExcel(): void {
    if (this.resultados.length === 0) return;

    // 2. Datos transformados de la tabla
    const datosTabla = this.resultados.map(item => ({
      'Id Producto': item.niD_PRODUCTO,
      'Descripción Producto': item.sdescripcioN_PRODUCTO,
      'Doc Identidad': item.snrO_DOCUMENTO_ASEGURADO,
      'Tipo Documento': item.stipO_DOCUMENTO_ASEGURADO,
      'Número de Póliza': item.snumerO_POLIZA,
      'Operation PK': item.operationpk,
      'Número Crédito': item.snumerO_CREDITO,
      'Inicio Cobertura': item.siniciO_CIBERTURA,
      'Fin Cobertura': item.sfiN_COBERTURA,
      'Monto Asegurado': item.nmontO_ASEGURADO,
      'Prima': item.nprima,
      'Moneda': item.smoneda,
      'Fecha Inicio Póliza': item.inI_POLIZA,
      'Fecha Fin Póliza': item.fiN_POLIZA || '-',
      'Fecha Desembolso Crédito': item.sfechA_DESEMBOLSO_CREDITO || '-',
      'Fecha Vencimiento Crédito': item.sfechA_VENCIMIENTO_CREDITO || '-',
      'Fecha Proceso': item.sfechA_PROCESO,
      'Contratante': item.contratante,
      'Canal': item.canal,
      'Canal Vinculado': item.eS_CANAL_VINCULADO,
      'Estado Póliza': item.estadO_POLIZA,
      'Evento Póliza': item.eventO_POLIZA,
      'Estado UR': item.estadO_UR,

    }));

    // 3. Unir datos cliente + tabla
    const hojaFinal = [...datosTabla];

    // 4. Crear hoja y libro Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(hojaFinal, { skipHeader: false });
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Resultados': worksheet },
      SheetNames: ['Resultados']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `resultados_${new Date().toISOString().slice(0, 19)}.xlsx`);
  }

  

//   buscar() {
//   if (!this.terminoBusqueda) {
//     this.resultado = 'Por favor ingrese un número de documento.';
//     return;
//   }

//   this.cargando = true;
//   this.resultado = '';
//   this.resultados = [];
//   this.groupedResultados = {};

//   this.coverageService.getCoverage(this.terminoBusqueda, this.tipoDocumento).subscribe({
//     next: (response) => {
//       this.resultados = response.data || [];
//       this.resultado = `Se encontraron ${response.pagination.totalItems} registros`;

//       // Agrupar por descripción de producto
//       this.groupedResultados = this.resultados.reduce((acc, item) => {
//         const key = (item.sdescripcioN_PRODUCTO || 'Sin descripción').trim().toLowerCase();
//         if (!acc[key]) acc[key] = [];
//         acc[key].push(item);
//         return acc;
//       }, {} as { [descripcion: string]: any[] });

//       this.cargando = false;
//     },
//     error: (err) => {
//       console.error(err);
//       this.resultado = 'Ocurrió un error al obtener los datos.';
//       this.resultados = [];
//       this.groupedResultados = {};
//       this.cargando = false;
//     }
//   });
// }

buscar() {
  if (!this.terminoBusqueda) {
    this.resultado = 'Por favor ingrese un número de documento.';
    return;
  }

  this.cargando = true;
  this.resultado = '';
  this.resultados = [];
  this.groupedResultados = {};

  this.coverageService.getCoverage(this.terminoBusqueda, this.tipoDocumento).subscribe({
    next: (response) => {
      this.resultados = response.data || [];
      this.resultado = `Se encontraron ${response.pagination?.totalItems ?? this.resultados.length} registros`;

      // Agrupar por descripción de producto
      this.groupedResultados = this.resultados.reduce((acc, item) => {
        const key = (item.sdescripcioN_PRODUCTO || 'Sin descripción').trim().toLowerCase();
        (acc[key] ||= []).push(item);
        return acc;
      }, {} as { [descripcion: string]: any[] });

      this.cargando = false;
    },
    error: (err: HttpErrorResponse) => {
      // Log básico
      console.error('[HTTP ERROR]', err);

      // Log detallado
      this.logHttpErrorDetalles(err);

      // Mensaje amigable para el usuario
      this.resultado = this.mensajeUsuarioPorError(err);
      this.resultados = [];
      this.groupedResultados = {};
      this.cargando = false;
    }
  });
}

/** Imprime en consola TODA la info útil del error, incluso si viene como Blob */
private logHttpErrorDetalles(err: HttpErrorResponse) {
  const base = {
    status: err.status,
    statusText: err.statusText,
    url: err.url,
    message: err.message,
  };
  console.groupCollapsed('%c⛔ Detalle de error HTTP', 'color:#b00;font-weight:bold;');
  console.log('Base:', base);

  // 1) Si el body ya es objeto/string:
  if (err.error && !(err.error instanceof Blob)) {
    try {
      console.log('Body (objeto/string):', typeof err.error === 'string' ? err.error : JSON.stringify(err.error, null, 2));
      // Si es ProblemDetails/ValidationProblemDetails de ASP.NET Core:
      const anyErr: any = err.error;
      if (anyErr?.title || anyErr?.detail || anyErr?.errors) {
        console.table({
          title: anyErr.title,
          detail: anyErr.detail,
          type: anyErr.type,
          instance: anyErr.instance,
        });
        if (anyErr.errors) {
          console.log('Validation errors:', anyErr.errors);
        }
      }
    } catch {
      console.log('Body (raw):', err.error);
    }
    console.groupEnd();
    return;
  }

  // 2) Si el body viene como Blob (p.ej. texto/JSON desde ASP.NET con UseExceptionHandler)
  if (err.error instanceof Blob) {
    const mime = err.error.type || 'application/octet-stream';
    console.log('Body es Blob. type:', mime, 'size:', err.error.size);
    // Intentar leerlo como texto
    from(err.error.text()).subscribe({
      next: (text) => {
        console.log('Blob (texto):', text);
        try {
          const parsed = JSON.parse(text);
          console.log('Blob parseado a JSON:', parsed);
        } catch {
          // no era JSON
        }
        console.groupEnd();
      },
      error: (blobReadErr) => {
        console.warn('No se pudo leer el Blob:', blobReadErr);
        console.groupEnd();
      }
    });
    return;
  }

  // 3) Caso sin body
  console.log('Sin cuerpo de error (err.error es null/undefined)');
  console.groupEnd();
}

/** Devuelve un mensaje legible para UI según el tipo de fallo */
private mensajeUsuarioPorError(err: HttpErrorResponse): string {
  if (err.status === 0) {
    // Desconexión, CORS, SSL o servidor caído
    return 'No se pudo conectar con el servidor (posible CORS/SSL/servidor caído). Ver consola para detalles.';
  }

  // Si el backend envía ProblemDetails con title/detail
  const anyErr: any = err.error;
  const detail =
    anyErr?.detail ??
    anyErr?.title ??
    (typeof anyErr === 'string' ? anyErr : null);

  return detail
    ? `Error ${err.status} ${err.statusText}: ${detail}`
    : `Error ${err.status} ${err.statusText}. Revisa la consola para más detalles.`;
}

}
