import { BackendAction } from '../../Backend'
import { DataObjectClass } from '../../components'

export default interface Middleware {
   execute: (dataObject: DataObjectClass<any>, action: BackendAction, params?: any) => void
}
