import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
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

    // // 1. Datos del cliente
    // const cliente = this.resultados[0];
    // const datosCliente = [
    //   { 'Nombre': cliente.snombrE_COMPLETO },
    //   { 'Doc Identidad': cliente.snrO_DOCUMENTO_ASEGURADO },
    //   { 'Tipo Documento': cliente.stipO_DOCUMENTO_ASEGURADO },
    //   {}, // fila vacía para separar visualmente
    // ];

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
      'Fecha Proceso': item.sfechA_PROCESO
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

  buscar() {
    if (!this.terminoBusqueda) {
      this.resultado = 'Por favor ingrese un número de documento.';
      return;
    }

    this.cargando = true;
    this.resultado = '';
    this.resultados = [];
    this.groupedResultados = {};

    console.log('Descripciones únicas:', [...new Set(this.resultados.map(x => `"${x.sdescripcioN_PRODUCTO}"`))]);

    this.coverageService.getCoverage(this.terminoBusqueda).subscribe({
      next: (response) => {
        this.resultados = response.data || [];
        console.log('Resultados obtenidos:', this.resultados);
        this.resultado = `Se encontraron ${response.pagination.totalItems} registros`;

        // Agrupar por sdescripcioN_PRODUCTO
        this.groupedResultados = this.resultados.reduce((acc, item) => {
          const rawKey = item.sdescripcioN_PRODUCTO || 'Sin descripción';
          const key = rawKey.trim().toLowerCase(); // normalización
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as { [descripcion: string]: any[] });


        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.resultado = 'Ocurrió un error al obtener los datos.';
        this.resultados = [];
        this.groupedResultados = {};
        this.cargando = false;
      }
    });
  }
}
