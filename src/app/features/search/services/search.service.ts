import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7144/api/Coverage/getIndexData';


  getCoverage(documentNumber: string) {
    const documentType = this.getDocumentType(documentNumber);

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

    return this.http.post<any>(this.apiUrl, payload);
  }

  private getDocumentType(doc: string): string {
    switch (doc.length) {
      case 8: return '1';  // DNI
      case 11: return '6'; // RUC
      case 12: return '7'; // PS
      default: return '1'; // Default to DNI
    }
  }
}
