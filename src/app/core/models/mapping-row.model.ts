/* tslint:disable */
import { MappingDestination } from "./mapping-destination.model";
import { MappingSource } from "./mapping-source.model";

export type MappingRow = {
    auto_mapped: boolean;
    ccc_value?: string;
    fyle_value: string;
    netsuite_value: string;
    source: MappingSource;
    destination: MappingDestination;
};
