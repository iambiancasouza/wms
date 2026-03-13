import { Tables, TablesInsert, TablesUpdate } from './database.types'


// export type Profile = Tables<'profiles'>
// export type ProfileInsert = TablesInsert<'profiles'>
// export type ProfileUpdate = TablesUpdate<'profiles'>

export type Product = Tables<'products'>
export type Routine = Tables<'user_routines'>
export type Procedure = Tables<'procedures'>
export type FinishedProduct = Tables<'finished_products'>

export type ProductInsert = TablesInsert<'products'>
export type RoutineInsert = TablesInsert<'user_routines'>
export type ProcedureInsert = TablesInsert<'procedures'>

export type ProductUpdate = TablesUpdate<'products'>
export type RoutineUpdate = TablesUpdate<'user_routines'>

export function safeQuantity(q: number | null | undefined) {
  return q ?? 1
}