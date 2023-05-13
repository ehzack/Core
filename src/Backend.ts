export const CREATE = 'create'
export const READ = 'read'
export const UPDATE = 'update'
export const DELETE = 'delete'

export type BackendActions =
   | typeof CREATE
   | typeof READ
   | typeof UPDATE
   | typeof DELETE
