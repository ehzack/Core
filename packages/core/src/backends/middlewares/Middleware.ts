import { BackendAction } from '../../Backend'
import { DataObjectClass } from '../../components'

export default interface BackendMiddleware {
   execute: (dataObject: DataObjectClass<any>, action: BackendAction, params?: any) => void
}
