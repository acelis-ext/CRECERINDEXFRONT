import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { CoverageItem, CoverageResponse } from '../models/data.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  private http = inject(HttpClient);
  private endpoint = environment.apiBaseUrl+'/api/';
  private apiUrl = `${this.endpoint}Coverage/getIndexData`;


  // getCoverage(documentNumber: string) {
  //   const documentType = this.getDocumentType(documentNumber);

  //   const payload = {
  //     sdocumentnumber: documentNumber,
  //     sdocumenttype: documentType,
  //     sname: '',
  //     pagination: {
  //       currentPage: 1,
  //       itemsPerPage: 1000,
  //       totalItems: 0,
  //       totalPages: 0
  //     }
  //   };

  //   return this.http.post<any>(this.apiUrl, payload);
  // }


  getCoverage(documentNumber: string, documentType: string) {
    console.log('getCoverage called with:', documentNumber, documentType);
  const payload = {
    sdocumentnumber: documentNumber,
    sdocumenttype: documentType,
    sname: '',
    pagination: {
      currentPage: 1,
      itemsPerPage: 1000,
      totalItems: 0,
      totalPages: 0
    }
  };
 console.log('Payload:', payload);
  return this.http.post<CoverageResponse>(this.apiUrl, payload);
}


  private getDocumentType(doc: string): string {
    switch (doc.length) {
      case 8: return '1';  // DNI
      //CARNET DE EXTRAJERIA 
      // case 11: return '4'; // CE

      case 11: return '6'; // RUC
      case 12: return '7'; // PS
      default: return '1'; // Default to DNI
    }
  }
}
