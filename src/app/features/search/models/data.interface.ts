export interface CoverageItem {
  nid: number;
  niD_PRODUCTO: string;
  sdescripcioN_PRODUCTO: string;
  snumerO_POLIZA: string;
  snumerO_CREDITO: string;
  stipO_DOCUMENTO_ASEGURADO: string;
  snrO_DOCUMENTO_ASEGURADO: string;
  snombrE_COMPLETO: string;
  snombreS_RAZONSOCIAL_ASEGURADO: string;
  sapellidO_PATERNO_ASEGURADO: string;
  sapellidO_MATERNO_ASEGURADO: string;
  siniciO_CIBERTURA: string;
  sfiN_COBERTURA: string;
  nmontO_ASEGURADO: number;
  nprima: number;
  smoneda: string;
  sfechA_DESEMBOLSO_CREDITO: string;
  sfechA_VENCIMIENTO_CREDITO: string;
  sfechA_PROCESO: string;
  operationpk: number;
  contratante: string;
  canal: string;
  eS_CANAL_VINCULADO: string;
  estadO_POLIZA: string;
  eventO_POLIZA: string;
  estadO_UR: string;
  inI_POLIZA: string;
  fiN_POLIZA: string;
}

export interface CoverageResponse {
  data: CoverageItem[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
