import { DataObjectClass } from '../components/types/DataObjectClass';
import { QueryResultType } from './Query';
import { Filter } from './Filter';
import { Filters } from './Filters';
import { SortAndLimit } from './SortAndLimit';
import { AbstractAdapter } from './AbstractAdapter';
import { BackendInterface } from './types/BackendInterface';
import { BackendRecordType } from '../Backend';
export declare class MockAdapter extends AbstractAdapter implements BackendInterface {
    protected static _fixtures: any;
    /**
     * Inject fixtures data to backend adapter
     * @param data BackendRecordType
     */
    static inject(data: BackendRecordType): void;
    static dao2backend(data: BackendRecordType): Promise<any>;
    static getFixtures(): any[];
    static getFixture(key: string): any;
    create(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    read(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    update(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    delete(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    deleteCollection(collection: string, batchSize?: number | undefined): Promise<void>;
    find(dataObject: DataObjectClass<any>, filters?: Filters | Filter[] | undefined, pagination?: SortAndLimit | undefined): Promise<QueryResultType<DataObjectClass<any>>>;
}
