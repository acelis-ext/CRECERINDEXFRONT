// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { SearchService } from '../../../search/services/search.service';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
// import { HttpErrorResponse } from '@angular/common/http';



// interface FilaExcel {
//   numero_documento: string;
//   tipo_documento: string;
// }

// interface ResultadoProcesado {
//   numero_documento: string;
//   tipo_documento: string;
//   codigo_tipo: string;
//   estado: 'pendiente' | 'procesando' | 'completado' | 'error';
//   resultados: any[];
//   productos: string;
//   error?: string;
// }

// @Component({
//   selector: 'app-searchmassive',
//   imports: [CommonModule, RouterModule, FormsModule],
//   templateUrl: './searchmassive.html',
//   styleUrl: './searchmassive.css'
// })




// export class Searchmassive {

//   archivoSeleccionado: File | null = null;
//   nombreArchivo = '';
//   filasLeidas: FilaExcel[] = [];
//   resultadosProcesados: ResultadoProcesado[] = [];

//   // Progreso
//   procesando = false;
//   totalFilas = 0;
//   filasCompletadas = 0;
//   porcentaje = 0;
//   mensajeEstado = '';

//   // Errores
//   errorArchivo = '';

//   // Descarga
//   descargaLista = false;

//   constructor(private coverageService: SearchService) {}

//   onArchivoSeleccionado(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (!input.files?.length) return;

//     this.resetEstado();
//     const file = input.files[0];

//     // Validar extensión
//     const ext = file.name.split('.').pop()?.toLowerCase();
//     if (ext !== 'xlsx' && ext !== 'xls') {
//       this.errorArchivo = 'Solo se permiten archivos Excel (.xlsx, .xls)';
//       return;
//     }

//     this.archivoSeleccionado = file;
//     this.nombreArchivo = file.name;
//     this.leerExcel(file);
//   }

//   private leerExcel(file: File) {
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const hoja = workbook.Sheets[workbook.SheetNames[0]];
//         const filas: any[] = XLSX.utils.sheet_to_json(hoja, { header: 1 });

//         if (filas.length < 2) {
//           this.errorArchivo = 'El archivo debe tener al menos una fila de datos (además de la cabecera).';
//           return;
//         }

//         // Saltar cabecera (fila 0)
//         this.filasLeidas = [];
//         for (let i = 1; i < filas.length; i++) {
//           const fila = filas[i];
//           const doc = String(fila[0] ?? '').trim();
//           const tipo = String(fila[1] ?? '').trim().toUpperCase();
//           if (!doc) continue; // saltar filas vacías

//           this.filasLeidas.push({
//             numero_documento: doc,
//             tipo_documento: tipo
//           });
//         }

//         if (this.filasLeidas.length === 0) {
//           this.errorArchivo = 'No se encontraron filas válidas en el archivo.';
//           return;
//         }

//         this.totalFilas = this.filasLeidas.length;
//         this.mensajeEstado = `Se leyeron ${this.totalFilas} registros del archivo. Listo para procesar.`;

//       } catch {
//         this.errorArchivo = 'Error al leer el archivo Excel. Verifique el formato.';
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   }

//   private mapTipoDocumento(label: string): string {
//   const mapa: Record<string, string> = {
//     'DNI': '1',
//     'C. EXTRANJERÍA': '4',
//     'C. EXTRANJERIA': '4',
//     'CE': '4',
//     'CARNET DE EXTRANJERÍA': '4',
//     'CARNET DE EXTRANJERIA': '4',
//     'RUC': '6',
//     'PASAPORTE': '7',
//     'PAS': '7',
//   };
//   return mapa[label.toUpperCase()] ?? '1';
// }

//   async procesarMasivo() {
//     if (this.filasLeidas.length === 0) return;

//     this.procesando = true;
//     this.descargaLista = false;
//     this.filasCompletadas = 0;
//     this.porcentaje = 0;
//     this.resultadosProcesados = [];

//     // Preparar estructura
//     for (const fila of this.filasLeidas) {
//       this.resultadosProcesados.push({
//         numero_documento: fila.numero_documento,
//         tipo_documento: fila.tipo_documento,
//         codigo_tipo: this.mapTipoDocumento(fila.tipo_documento),
//         estado: 'pendiente',
//         resultados: [],
//         productos: ''
//       });
//     }

//     // Procesar secuencialmente para no saturar el backend
//     for (let i = 0; i < this.resultadosProcesados.length; i++) {
//       const item = this.resultadosProcesados[i];
//       item.estado = 'procesando';
//       this.mensajeEstado = `Procesando ${i + 1} de ${this.totalFilas}: ${item.numero_documento}...`;

//       try {
//         const response = await this.coverageService
//           .getCoverage(item.numero_documento, item.codigo_tipo)
//           .toPromise();

//         item.resultados = response?.data || [];

//         // Extraer productos únicos
//         const productosSet = new Set<string>();
//         for (const r of item.resultados) {
//           const desc = (r.sdescripcioN_PRODUCTO || '').trim();
//           if (desc) productosSet.add(desc);
//         }
//         item.productos = Array.from(productosSet).join(' | ');
//         item.estado = 'completado';

//       } catch (err: any) {
//         item.estado = 'error';
//         item.error = err?.status ? `Error ${err.status}` : 'Error de conexión';
//         item.productos = '';
//       }

//       this.filasCompletadas = i + 1;
//       this.porcentaje = Math.round((this.filasCompletadas / this.totalFilas) * 100);
//     }

//     this.procesando = false;
//     this.descargaLista = true;
//     this.mensajeEstado = `Proceso completado. ${this.filasCompletadas} de ${this.totalFilas} registros procesados.`;
//   }

//   descargarResultadosExcel() {
//     if (this.resultadosProcesados.length === 0) return;

//     const datosExcel: any[] = [];

//     for (const item of this.resultadosProcesados) {
//       if (item.resultados.length === 0) {
//         // Fila sin resultados
//         datosExcel.push({
//           'Número Documento': item.numero_documento,
//           'Tipo Documento': item.tipo_documento,
//           'Id Producto': '-',
//           'Descripción Producto': '-',
//           'Nombre Asegurado': '-',
//           'Número de Póliza': '-',
//           'Operation PK': '-',
//           'Número Crédito': '-',
//           'Inicio Cobertura': '-',
//           'Fin Cobertura': '-',
//           'Monto Asegurado': '-',
//           'Prima': '-',
//           'Moneda': '-',
//           'Fecha Inicio Póliza': '-',
//           'Fecha Fin Póliza': '-',
//           'Fecha Desembolso Crédito': '-',
//           'Fecha Vencimiento Crédito': '-',
//           'Fecha Proceso': '-',
//           'Contratante': '-',
//           'Canal': '-',
//           'Canal Vinculado': '-',
//           'Estado Póliza': '-',
//           'Evento Póliza': '-',
//           'Estado UR': '-',
//           'Rol': '-',
//           'Productos Encontrados': item.estado === 'error' ? item.error! : 'Sin resultados',
//         });
//       } else {
//         for (const r of item.resultados) {
//           datosExcel.push({
//             'Número Documento': item.numero_documento,
//             'Tipo Documento': item.tipo_documento,
//             'Id Producto': r.niD_PRODUCTO,
//             'Descripción Producto': r.sdescripcioN_PRODUCTO,
//             'Nombre Asegurado': r.snombrE_COMPLETO || r.snombreS_RAZONSOCIAL_ASEGURADO || '-',
//             'Número de Póliza': r.snumerO_POLIZA,
//             'Operation PK': r.operationpk,
//             'Número Crédito': r.snumerO_CREDITO,
//             'Inicio Cobertura': r.siniciO_CIBERTURA,
//             'Fin Cobertura': r.sfiN_COBERTURA,
//             'Monto Asegurado': r.nmontO_ASEGURADO,
//             'Prima': r.nprima,
//             'Moneda': r.smoneda,
//             'Fecha Inicio Póliza': r.inI_POLIZA,
//             'Fecha Fin Póliza': r.fiN_POLIZA || '-',
//             'Fecha Desembolso Crédito': r.sfechA_DESEMBOLSO_CREDITO || '-',
//             'Fecha Vencimiento Crédito': r.sfechA_VENCIMIENTO_CREDITO || '-',
//             'Fecha Proceso': r.sfechA_PROCESO,
//             'Contratante': r.contratante || '-',
//             'Canal': r.canal || '-',
//             'Canal Vinculado': r.eS_CANAL_VINCULADO || '-',
//             'Estado Póliza': r.estadO_POLIZA || '-',
//             'Evento Póliza': r.eventO_POLIZA || '-',
//             'Estado UR': r.estadO_UR || '-',
//             'Rol': r.rol || '-',
//             'Productos Encontrados': item.productos,
//           });
//         }
//       }
//     }

//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel, { skipHeader: false });

//     // Auto-ancho de columnas
//     const cols = Object.keys(datosExcel[0] || {}).map(key => ({
//       wch: Math.max(key.length, 15)
//     }));
//     worksheet['!cols'] = cols;

//     const workbook: XLSX.WorkBook = {
//       Sheets: { 'Resultados Masivos': worksheet },
//       SheetNames: ['Resultados Masivos']
//     };

//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     FileSaver.saveAs(blob, `busqueda_masiva_${new Date().toISOString().slice(0, 19)}.xlsx`);
//   }

//   descargarPlantilla() {
//     const plantilla = [
//       { 'numero_documento': '71328491', 'tipo_documento': 'DNI' },
//       { 'numero_documento': '20100047218', 'tipo_documento': 'RUC' },
//     ];

//     const ws = XLSX.utils.json_to_sheet(plantilla);
//     ws['!cols'] = [{ wch: 20 }, { wch: 20 }];
//     const wb: XLSX.WorkBook = { Sheets: { 'Plantilla': ws }, SheetNames: ['Plantilla'] };
//     const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     FileSaver.saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'plantilla_busqueda_masiva.xlsx');
//   }

//   resetEstado() {
//     this.archivoSeleccionado = null;
//     this.nombreArchivo = '';
//     this.filasLeidas = [];
//     this.resultadosProcesados = [];
//     this.procesando = false;
//     this.totalFilas = 0;
//     this.filasCompletadas = 0;
//     this.porcentaje = 0;
//     this.mensajeEstado = '';
//     this.errorArchivo = '';
//     this.descargaLista = false;
//   }

//   // Contadores para el resumen
//   get totalCompletados(): number {
//     return this.resultadosProcesados.filter(r => r.estado === 'completado').length;
//   }
//   get totalErrores(): number {
//     return this.resultadosProcesados.filter(r => r.estado === 'error').length;
//   }
//   get totalConResultados(): number {
//     return this.resultadosProcesados.filter(r => r.resultados.length > 0).length;
//   }
//   get totalSinResultados(): number {
//     return this.resultadosProcesados.filter(r => r.estado === 'completado' && r.resultados.length === 0).length;
//   }
// }


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../search/services/search.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

interface FilaExcel {
  numero_documento: string;
  tipo_documento: string;
}

interface ResultadoProcesado {
  numero_documento: string;
  tipo_documento: string;
  codigo_tipo: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'error';
  resultados: any[];
  productos: string;
  error?: string;
}

@Component({
  selector: 'app-searchmassive',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './searchmassive.html',
  styleUrl: './searchmassive.css'
})
export class Searchmassive {

  archivoSeleccionado: File | null = null;
  nombreArchivo = '';
  filasLeidas: FilaExcel[] = [];
  resultadosProcesados: ResultadoProcesado[] = [];

  // Progreso
  procesando = false;
  totalFilas = 0;
  filasCompletadas = 0;
  porcentaje = 0;
  mensajeEstado = '';

  // Errores
  errorArchivo = '';

  // Descarga
  descargaLista = false;

  // Tabla de tipos válidos para mostrar en la UI
  tiposDocumentoValidos = [
    { label: 'DNI', valores: 'DNI', codigo: '1' },
    { label: 'C. Extranjería', valores: 'CE, C. EXTRANJERÍA, C. EXTRANJERIA, CARNET DE EXTRANJERÍA, CARNET DE EXTRANJERIA', codigo: '4' },
    { label: 'RUC', valores: 'RUC', codigo: '6' },
    { label: 'Pasaporte', valores: 'PASAPORTE, PAS', codigo: '7' },
  ];

  constructor(private coverageService: SearchService) {}

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.resetEstado();
    const file = input.files[0];

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      this.errorArchivo = 'Solo se permiten archivos Excel (.xlsx, .xls)';
      return;
    }

    this.archivoSeleccionado = file;
    this.nombreArchivo = file.name;
    this.leerExcel(file);
  }

  private leerExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const filas: any[] = XLSX.utils.sheet_to_json(hoja, { header: 1 });

        if (filas.length < 2) {
          this.errorArchivo = 'El archivo debe tener al menos una fila de datos (además de la cabecera).';
          return;
        }

        this.filasLeidas = [];
        for (let i = 1; i < filas.length; i++) {
          const fila = filas[i];
          const doc = String(fila[0] ?? '').trim();
          const tipo = String(fila[1] ?? '').trim().toUpperCase();
          if (!doc) continue;

          this.filasLeidas.push({
            numero_documento: doc,
            tipo_documento: tipo
          });
        }

        if (this.filasLeidas.length === 0) {
          this.errorArchivo = 'No se encontraron filas válidas en el archivo.';
          return;
        }

        this.totalFilas = this.filasLeidas.length;
        this.mensajeEstado = `Se leyeron ${this.totalFilas} registros del archivo. Listo para procesar.`;

      } catch {
        this.errorArchivo = 'Error al leer el archivo Excel. Verifique el formato.';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  private mapTipoDocumento(label: string): string {
    const mapa: Record<string, string> = {
      'DNI': '1',
      'C. EXTRANJERÍA': '4',
      'C. EXTRANJERIA': '4',
      'CE': '4',
      'CARNET DE EXTRANJERÍA': '4',
      'CARNET DE EXTRANJERIA': '4',
      'RUC': '6',
      'PASAPORTE': '7',
      'PAS': '7',
    };
    return mapa[label.toUpperCase()] ?? '1';
  }

  async procesarMasivo() {
    if (this.filasLeidas.length === 0) return;

    this.procesando = true;
    this.descargaLista = false;
    this.filasCompletadas = 0;
    this.porcentaje = 0;
    this.resultadosProcesados = [];

    for (const fila of this.filasLeidas) {
      this.resultadosProcesados.push({
        numero_documento: fila.numero_documento,
        tipo_documento: fila.tipo_documento,
        codigo_tipo: this.mapTipoDocumento(fila.tipo_documento),
        estado: 'pendiente',
        resultados: [],
        productos: ''
      });
    }

    for (let i = 0; i < this.resultadosProcesados.length; i++) {
      const item = this.resultadosProcesados[i];
      item.estado = 'procesando';
      this.mensajeEstado = `Procesando ${i + 1} de ${this.totalFilas}: ${item.numero_documento}...`;

      try {
        const response = await this.coverageService
          .getCoverage(item.numero_documento, item.codigo_tipo)
          .toPromise();

        item.resultados = response?.data || [];

        const productosSet = new Set<string>();
        for (const r of item.resultados) {
          const desc = (r.sdescripcioN_PRODUCTO || '').trim();
          if (desc) productosSet.add(desc);
        }
        item.productos = Array.from(productosSet).join(' | ');
        item.estado = 'completado';

      } catch (err: any) {
        item.estado = 'error';
        item.error = err?.status ? `Error ${err.status}` : 'Error de conexión';
        item.productos = '';
      }

      this.filasCompletadas = i + 1;
      this.porcentaje = Math.round((this.filasCompletadas / this.totalFilas) * 100);
    }

    this.procesando = false;
    this.descargaLista = true;
    this.mensajeEstado = `Proceso completado. ${this.filasCompletadas} de ${this.totalFilas} registros procesados.`;
  }

  descargarResultadosExcel() {
    if (this.resultadosProcesados.length === 0) return;

    const datosExcel: any[] = [];

    for (const item of this.resultadosProcesados) {
      if (item.resultados.length === 0) {
        datosExcel.push({
          'Número Documento': item.numero_documento,
          'Tipo Documento': item.tipo_documento,
          'Id Producto': '-',
          'Descripción Producto': '-',
          'Nombre Asegurado': '-',
          'Número de Póliza': '-',
          'Operation PK': '-',
          'Número Crédito': '-',
          'Inicio Cobertura': '-',
          'Fin Cobertura': '-',
          'Monto Asegurado': '-',
          'Prima': '-',
          'Moneda': '-',
          'Fecha Inicio Póliza': '-',
          'Fecha Fin Póliza': '-',
          'Fecha Desembolso Crédito': '-',
          'Fecha Vencimiento Crédito': '-',
          'Fecha Proceso': '-',
          'Contratante': '-',
          'Canal': '-',
          'Canal Vinculado': '-',
          'Estado Póliza': '-',
          'Evento Póliza': '-',
          'Estado UR': '-',
          'Rol': '-',
          'Productos Encontrados': item.estado === 'error' ? item.error! : 'Sin resultados',
        });
      } else {
        for (const r of item.resultados) {
          datosExcel.push({
            'Número Documento': item.numero_documento,
            'Tipo Documento': item.tipo_documento,
            'Id Producto': r.niD_PRODUCTO,
            'Descripción Producto': r.sdescripcioN_PRODUCTO,
            'Nombre Asegurado': r.snombrE_COMPLETO || r.snombreS_RAZONSOCIAL_ASEGURADO || '-',
            'Número de Póliza': r.snumerO_POLIZA,
            'Operation PK': r.operationpk,
            'Número Crédito': r.snumerO_CREDITO,
            'Inicio Cobertura': r.siniciO_CIBERTURA,
            'Fin Cobertura': r.sfiN_COBERTURA,
            'Monto Asegurado': r.nmontO_ASEGURADO,
            'Prima': r.nprima,
            'Moneda': r.smoneda,
            'Fecha Inicio Póliza': r.inI_POLIZA,
            'Fecha Fin Póliza': r.fiN_POLIZA || '-',
            'Fecha Desembolso Crédito': r.sfechA_DESEMBOLSO_CREDITO || '-',
            'Fecha Vencimiento Crédito': r.sfechA_VENCIMIENTO_CREDITO || '-',
            'Fecha Proceso': r.sfechA_PROCESO,
            'Contratante': r.contratante || '-',
            'Canal': r.canal || '-',
            'Canal Vinculado': r.eS_CANAL_VINCULADO || '-',
            'Estado Póliza': r.estadO_POLIZA || '-',
            'Evento Póliza': r.eventO_POLIZA || '-',
            'Estado UR': r.estadO_UR || '-',
            'Rol': r.rol || '-',
            'Productos Encontrados': item.productos,
          });
        }
      }
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel, { skipHeader: false });
    const cols = Object.keys(datosExcel[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = cols;

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Resultados Masivos': worksheet },
      SheetNames: ['Resultados Masivos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `busqueda_masiva_${new Date().toISOString().slice(0, 19)}.xlsx`);
  }

  descargarPlantilla() {
    // Hoja 1: Plantilla de datos
    const plantilla = [
      { 'numero_documento': '71328491', 'tipo_documento': 'DNI' },
      { 'numero_documento': '20100047218', 'tipo_documento': 'RUC' },
      { 'numero_documento': '001234567', 'tipo_documento': 'CE' },
      { 'numero_documento': 'AB1234567', 'tipo_documento': 'PAS' },
    ];
    const wsDatos = XLSX.utils.json_to_sheet(plantilla);
    wsDatos['!cols'] = [{ wch: 22 }, { wch: 22 }];

    // Hoja 2: Leyenda de tipos de documento
    const leyenda = [
      ['LEYENDA - Tipos de Documento Válidos', ''],
      ['', ''],
      ['Tipo de Documento', 'Valores aceptados en la columna tipo_documento'],
      ['DNI', 'DNI'],
      ['Carnet de Extranjería', 'CE, C. EXTRANJERÍA, C. EXTRANJERIA, CARNET DE EXTRANJERÍA, CARNET DE EXTRANJERIA'],
      ['RUC', 'RUC'],
      ['Pasaporte', 'PASAPORTE, PAS'],
      ['', ''],
      ['NOTAS IMPORTANTES', ''],
      ['1. La primera columna debe llamarse "numero_documento"', ''],
      ['2. La segunda columna debe llamarse "tipo_documento"', ''],
      ['3. No importa si escribe en mayúsculas o minúsculas', ''],
      ['4. Si el tipo de documento no es reconocido, se asumirá DNI por defecto', ''],
      ['5. No deje filas vacías entre los datos', ''],
      ['6. La primera fila (cabecera) será ignorada durante el procesamiento', ''],
    ];
    const wsLeyenda = XLSX.utils.aoa_to_sheet(leyenda);
    wsLeyenda['!cols'] = [{ wch: 55 }, { wch: 70 }];

    // Merge para el título
    wsLeyenda['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    ];

    const wb: XLSX.WorkBook = {
      Sheets: {
        'Datos': wsDatos,
        'Leyenda': wsLeyenda
      },
      SheetNames: ['Datos', 'Leyenda']
    };

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'plantilla_busqueda_masiva.xlsx');
  }

  resetEstado() {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.filasLeidas = [];
    this.resultadosProcesados = [];
    this.procesando = false;
    this.totalFilas = 0;
    this.filasCompletadas = 0;
    this.porcentaje = 0;
    this.mensajeEstado = '';
    this.errorArchivo = '';
    this.descargaLista = false;
  }

  get totalCompletados(): number {
    return this.resultadosProcesados.filter(r => r.estado === 'completado').length;
  }
  get totalErrores(): number {
    return this.resultadosProcesados.filter(r => r.estado === 'error').length;
  }
  get totalConResultados(): number {
    return this.resultadosProcesados.filter(r => r.resultados.length > 0).length;
  }
  get totalSinResultados(): number {
    return this.resultadosProcesados.filter(r => r.estado === 'completado' && r.resultados.length === 0).length;
  }
}