import { BackendAction } from '../../Backend'
import { DataObjectClass } from '../../components'
import * as actions from '../../Backend'

export default interface Middleware {
   execute: (dataObject: DataObjectClass<any>, action: BackendAction) => void
}
